/**
 * src/lib/monitoring/sla.ts
 * SLA Report Generator.
 * Computes monthly uptime, downtime, incidents from HealthLog records.
 */

import { PrismaClient, HealthCategory } from '@prisma/client';

const prisma = new PrismaClient();

// How long a single check window is considered to be (must match cron interval)
const CHECK_INTERVAL_MINUTES = 5;

export interface SlaReportData {
    year: number;
    month: number;
    uptimePercent: number;
    totalChecks: number;
    failedChecks: number;
    downtimeMinutes: number;
    avgLatencyMs: number;
    incidentsByCategory: Record<string, number>;
}

/**
 * Generate the SLA report for a specific year/month.
 * Aggregates all HealthLog rows within that calendar month.
 */
export async function generateSlaReport(year: number, month: number): Promise<SlaReportData> {
    // Date range for the requested month
    const start = new Date(year, month - 1, 1);          // First day of month
    const end = new Date(year, month, 1);               // First day of next month

    // ─ Count totals ─────────────────────────────────────────────────────────────
    const totalChecks = await prisma.healthLog.count({
        where: { testedAt: { gte: start, lt: end } },
    });

    const failedChecks = await prisma.healthLog.count({
        where: {
            testedAt: { gte: start, lt: end },
            status: { in: ['CRITICAL', 'WARNING'] },
        },
    });

    // ─ Average latency ───────────────────────────────────────────────────────────
    const latencyAgg = await prisma.healthLog.aggregate({
        where: {
            testedAt: { gte: start, lt: end },
            latencyMs: { not: null },
        },
        _avg: { latencyMs: true },
    });
    const avgLatencyMs = Math.round(latencyAgg._avg.latencyMs ?? 0);

    // ─ Uptime % ─────────────────────────────────────────────────────────────────
    const uptimePercent =
        totalChecks > 0
            ? Math.round(((totalChecks - failedChecks) / totalChecks) * 10000) / 100
            : 100;

    // ─ Downtime estimate ─────────────────────────────────────────────────────────
    // Each CRITICAL check window = CHECK_INTERVAL_MINUTES of downtime
    const criticalChecks = await prisma.healthLog.count({
        where: {
            testedAt: { gte: start, lt: end },
            status: 'CRITICAL',
        },
    });
    const downtimeMinutes = criticalChecks * CHECK_INTERVAL_MINUTES;

    // ─ Incidents by category ────────────────────────────────────────────────────
    const categories = Object.values(HealthCategory);
    const incidentsByCategory: Record<string, number> = {};

    for (const cat of categories) {
        const count = await prisma.healthLog.count({
            where: {
                testedAt: { gte: start, lt: end },
                category: cat,
                status: { in: ['CRITICAL', 'WARNING'] },
            },
        });
        incidentsByCategory[cat] = count;
    }

    return {
        year,
        month,
        uptimePercent,
        totalChecks,
        failedChecks,
        downtimeMinutes,
        avgLatencyMs,
        incidentsByCategory,
    };
}

/**
 * Generate + upsert the SLA report into the database.
 * Safe to call multiple times – it will overwrite the same month.
 */
export async function upsertSlaReport(year: number, month: number) {
    const data = await generateSlaReport(year, month);

    return prisma.slaReport.upsert({
        where: { year_month: { year, month } },
        update: {
            uptimePercent: data.uptimePercent,
            totalChecks: data.totalChecks,
            failedChecks: data.failedChecks,
            downtimeMinutes: data.downtimeMinutes,
            avgLatencyMs: data.avgLatencyMs,
            incidentsByCategory: data.incidentsByCategory,
            generatedAt: new Date(),
        },
        create: {
            year,
            month,
            uptimePercent: data.uptimePercent,
            totalChecks: data.totalChecks,
            failedChecks: data.failedChecks,
            downtimeMinutes: data.downtimeMinutes,
            avgLatencyMs: data.avgLatencyMs,
            incidentsByCategory: data.incidentsByCategory,
        },
    });
}

/**
 * Get all stored SLA reports (newest first).
 */
export async function getSlaReports(limit = 24) {
    return prisma.slaReport.findMany({
        orderBy: [{ year: 'desc' }, { month: 'desc' }],
        take: limit,
    });
}

/**
 * Get the current-month real-time SLA (not stored – computed live).
 */
export async function getCurrentMonthSla() {
    const now = new Date();
    return generateSlaReport(now.getFullYear(), now.getMonth() + 1);
}
