/**
 * scripts/health-monitor.ts
 * 24/7 Background Health Monitor.
 * Run with: npx tsx scripts/health-monitor.ts
 * In production, manage with PM2, Docker, or a process manager.
 */

import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import {
    runAllChecks,
    persistResults,
    cleanupOldLogs,
    type CheckResult,
} from '../src/lib/monitoring/checker';
import { upsertSlaReport } from '../src/lib/monitoring/sla';

const prisma = new PrismaClient();

// ── Config ────────────────────────────────────────────────────────────────────

const ALERT_COOLDOWN_MS = 30 * 60 * 1000; // 30 minutes smart de-dupe window
const MAX_RETRIES = 3;
const CRON_SCHEDULE = '*/5 * * * *'; // every 5 minutes

const ALERT_EMAIL = process.env.ALERT_EMAIL || process.env.SMTP_FROM || '';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

// ── Email ─────────────────────────────────────────────────────────────────────

async function sendEmail(subject: string, body: string): Promise<void> {
    if (!ALERT_EMAIL) return;
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: ALERT_EMAIL,
            subject,
            text: body,
            html: `<pre style="font-family:monospace">${body}</pre>`,
        });
        console.log(`[Monitor] Email alert sent: ${subject}`);
    } catch (err) {
        console.error('[Monitor] Email failed:', err);
    }
}

// ── Slack ─────────────────────────────────────────────────────────────────────

async function sendSlack(text: string): Promise<void> {
    if (!SLACK_WEBHOOK_URL) return;
    try {
        await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });
        console.log('[Monitor] Slack alert sent.');
    } catch (err) {
        console.error('[Monitor] Slack failed:', err);
    }
}

// ── Telegram ──────────────────────────────────────────────────────────────────

async function sendTelegram(text: string): Promise<void> {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
        });
        console.log('[Monitor] Telegram alert sent.');
    } catch (err) {
        console.error('[Monitor] Telegram failed:', err);
    }
}

// ── Smart Alert (de-duplicated) ───────────────────────────────────────────────

async function sendSmartAlert(result: CheckResult): Promise<void> {
    const now = new Date();

    // Get or create alert state for this service
    let alertState = await prisma.alertState.findUnique({
        where: { service: result.service },
    });

    // Check cooldown – suppress if already alerted recently
    if (alertState?.lastAlertAt) {
        const timeSinceLastAlert = now.getTime() - alertState.lastAlertAt.getTime();
        if (timeSinceLastAlert < ALERT_COOLDOWN_MS) {
            console.log(`[Monitor] Alert suppressed for ${result.service} (cooldown active)`);
            return;
        }
    }

    // Build the alert message
    const emoji = result.status === 'CRITICAL' ? '🔴' : '🟡';
    const subject = `${emoji} [Health Monitor] ${result.status}: ${result.service}`;
    const body = [
        `Service: ${result.service}`,
        `Status: ${result.status}`,
        `Category: ${result.category}`,
        `Time: ${now.toISOString()}`,
        result.url ? `URL: ${result.url}` : '',
        result.statusCode ? `HTTP Status: ${result.statusCode}` : '',
        result.latencyMs ? `Latency: ${result.latencyMs}ms` : '',
        result.errorMessage ? `Error: ${result.errorMessage}` : '',
    ]
        .filter(Boolean)
        .join('\n');

    // Send through all channels
    await Promise.allSettled([
        sendEmail(subject, body),
        sendSlack(`${subject}\n\`\`\`${body}\`\`\``),
        sendTelegram(`<b>${subject}</b>\n<pre>${body}</pre>`),
    ]);

    // Update alert state
    await prisma.alertState.upsert({
        where: { service: result.service },
        update: {
            lastAlertAt: now,
            isSuppressed: false,
            failCount: { increment: 1 },
        },
        create: {
            service: result.service,
            lastAlertAt: now,
            failCount: 1,
        },
    });
}

// ── Reset Alert State on Recovery ────────────────────────────────────────────

async function resetAlertState(service: string): Promise<void> {
    await prisma.alertState.upsert({
        where: { service },
        update: { failCount: 0, isSuppressed: false },
        create: { service, failCount: 0 },
    });
}

// ── Single Check Run with Retry Logic ────────────────────────────────────────

async function runWithRetry(
    fn: () => Promise<CheckResult[]>
): Promise<CheckResult[]> {
    let lastResults: CheckResult[] = [];

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const results = await fn();
        const failures = results.filter((r) => r.status !== 'OK');

        if (failures.length === 0) {
            return results;
        }

        console.log(
            `[Monitor] Attempt ${attempt}/${MAX_RETRIES} — ${failures.length} failure(s). Retrying...`
        );
        lastResults = results;

        if (attempt < MAX_RETRIES) {
            await new Promise((res) => setTimeout(res, 5000)); // wait 5s between retries
        }
    }

    return lastResults;
}

// ── Main Monitoring Loop ──────────────────────────────────────────────────────

async function runMonitorCycle(): Promise<void> {
    console.log(`[Monitor] Running health check at ${new Date().toISOString()}`);

    const results = await runWithRetry(runAllChecks);

    // Persist all results
    await persistResults(results);

    // Handle alerts and resets
    for (const result of results) {
        if (result.status === 'CRITICAL' || result.status === 'WARNING') {
            await sendSmartAlert(result);
        } else {
            await resetAlertState(result.service);
        }
    }

    // Summary
    const criticalCount = results.filter((r) => r.status === 'CRITICAL').length;
    const warningCount = results.filter((r) => r.status === 'WARNING').length;
    const okCount = results.filter((r) => r.status === 'OK').length;
    console.log(
        `[Monitor] Done — OK: ${okCount}, Warnings: ${warningCount}, Critical: ${criticalCount}`
    );
}

// ── Cleanup (run once daily at midnight) ─────────────────────────────────────

cron.schedule('0 0 * * *', async () => {
    console.log('[Monitor] Running 30-day log cleanup...');
    await cleanupOldLogs(30);
});

// ── Monthly SLA Report (1st of each month at 01:00 UTC) ──────────────────────

cron.schedule('0 1 1 * *', async () => {
    const now = new Date();
    // Generate report for the PREVIOUS month
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    console.log(`[Monitor] Generating SLA report for ${prevYear}/${prevMonth}...`);
    try {
        await upsertSlaReport(prevYear, prevMonth);
        console.log(`[Monitor] SLA report generated: ${prevYear}/${prevMonth}`);
    } catch (err) {
        console.error('[Monitor] SLA report generation failed:', err);
    }
});

// ── Start ─────────────────────────────────────────────────────────────────────

console.log('[Monitor] 🚀 Website Health Monitor starting...');
console.log(`[Monitor] Schedule: ${CRON_SCHEDULE}`);
console.log(`[Monitor] Channels: Email=${!!ALERT_EMAIL}, Slack=${!!SLACK_WEBHOOK_URL}, Telegram=${!!TELEGRAM_BOT_TOKEN}`);
console.log('[Monitor] Monthly SLA report: 1st of each month at 01:00 UTC');

// Run immediately on start, then on schedule
runMonitorCycle();

cron.schedule(CRON_SCHEDULE, runMonitorCycle);
