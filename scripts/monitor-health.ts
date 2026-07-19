/**
 * scripts/monitor-health.ts
 *
 * Daily health monitoring script.
 * Scans the HealthLog table for CRITICAL statuses within the last 24 hours
 * and sends an email alert to the dev/ops team via Brevo (SendinBlue) SMTP.
 *
 * Usage:
 *   npx ts-node -r tsconfig-paths/register scripts/monitor-health.ts
 *
 * Schedule (Linux cron - 07:00 daily):
 *   0 7 * * * cd /app && npx ts-node -r tsconfig-paths/register scripts/monitor-health.ts
 *
 * Schedule (Windows Task Scheduler):
 *   Trigger: Daily at 07:00
 *   Action:  cmd /c "cd E:\Projects\secure-marketplace && npx ts-node -r tsconfig-paths/register scripts/monitor-health.ts"
 *
 * Required env vars (in .env):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *   HEALTH_ALERT_EMAILS  (comma-separated list of recipients)
 */

import { prisma } from '../src/lib/db/client';
import nodemailer from 'nodemailer';

const ALERT_RECIPIENTS = (process.env.HEALTH_ALERT_EMAILS || 'admin@wassitt.com').split(',');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

async function runMonitoring() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  console.log(`[${new Date().toISOString()}] Scanning HealthLog for CRITICAL events since ${since.toISOString()}`);

  const criticalLogs = await prisma.healthLog.findMany({
    where: {
      status: 'CRITICAL',
      testedAt: { gte: since },
    },
    orderBy: { testedAt: 'desc' },
    take: 50,
  });

  if (criticalLogs.length === 0) {
    console.log('✅ No CRITICAL health events found. System is healthy.');
    await prisma.$disconnect();
    return;
  }

  console.warn(`⚠️  Found ${criticalLogs.length} CRITICAL health event(s). Sending alert email...`);

  const tableRows = criticalLogs.map((log: any) => `
    <tr>
      <td style="padding:8px;border:1px solid #ddd;">${new Date(log.testedAt).toISOString()}</td>
      <td style="padding:8px;border:1px solid #ddd;">${log.service}</td>
      <td style="padding:8px;border:1px solid #ddd;">${log.category}</td>
      <td style="padding:8px;border:1px solid #ddd;color:#dc2626;font-weight:bold;">${log.status}</td>
      <td style="padding:8px;border:1px solid #ddd;">${log.errorMessage || '—'}</td>
    </tr>
  `).join('');

  const html = `
    <h2 style="color:#dc2626;">🚨 Wassitt Platform — Health Alert</h2>
    <p>The following <strong>CRITICAL</strong> health events were detected in the last 24 hours:</p>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:13px;">
      <thead>
        <tr style="background:#f3f4f6;">
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Timestamp</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Service</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Category</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Status</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Error</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <p style="margin-top:16px;color:#6b7280;font-size:12px;">
      Sent by Wassitt automated monitoring at ${new Date().toISOString()}.
    </p>
  `;

  await transporter.sendMail({
    from: `"Wassitt Monitor" <${process.env.SMTP_FROM || 'noreply@wassitt.com'}>`,
    to: ALERT_RECIPIENTS.join(', '),
    subject: `🚨 [Wassitt] ${criticalLogs.length} CRITICAL health alert(s) detected`,
    html,
  });

  console.log(`✅ Alert email sent to: ${ALERT_RECIPIENTS.join(', ')}`);
  await prisma.$disconnect();
}

runMonitoring().catch(async (err) => {
  console.error('Monitor script failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
