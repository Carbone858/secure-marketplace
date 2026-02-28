'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────────────────────────

interface SlaReport {
    id: string;
    year: number;
    month: number;
    uptimePercent: number;
    totalChecks: number;
    failedChecks: number;
    downtimeMinutes: number;
    avgLatencyMs: number;
    incidentsByCategory: Record<string, number>;
    generatedAt: string;
}

interface CurrentMonth {
    year: number;
    month: number;
    uptimePercent: number;
    totalChecks: number;
    failedChecks: number;
    downtimeMinutes: number;
    avgLatencyMs: number;
    incidentsByCategory: Record<string, number>;
}

const MONTH_NAMES_EN = [
    '', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTH_NAMES_AR = [
    '', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

function uptimeColor(pct: number) {
    if (pct >= 99.9) return 'text-green-500';
    if (pct >= 99) return 'text-yellow-500';
    return 'text-red-500';
}

function uptimeBg(pct: number) {
    if (pct >= 99.9) return 'bg-green-500/10 border-green-500/30';
    if (pct >= 99) return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
}

export default function SlaReportTab() {
    const locale = useLocale();
    const isAr = locale === 'ar';

    const [reports, setReports] = useState<SlaReport[]>([]);
    const [current, setCurrent] = useState<CurrentMonth | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/health/sla');
            const json = await res.json();
            setReports(json.reports || []);
            setCurrent(json.currentMonth || null);
        } catch {
            toast.error(isAr ? 'فشل تحميل تقارير SLA' : 'Failed to load SLA reports');
        } finally {
            setLoading(false);
        }
    }, [isAr]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const generateReport = async () => {
        setGenerating(true);
        try {
            const now = new Date();
            const res = await fetch('/api/admin/health/sla', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ year: now.getFullYear(), month: now.getMonth() + 1 }),
            });
            if (!res.ok) throw new Error();
            toast.success(isAr ? 'تم إنشاء تقرير الشهر الحالي' : 'Current month report generated');
            await fetchData();
        } catch {
            toast.error(isAr ? 'فشل إنشاء التقرير' : 'Failed to generate report');
        } finally {
            setGenerating(false);
        }
    };

    // Chart data: last 6 months uptime
    const chartData = [...reports]
        .slice(0, 6)
        .reverse()
        .map(r => ({
            name: `${isAr ? MONTH_NAMES_AR[r.month] : MONTH_NAMES_AR[r.month].slice(0, 3) || MONTH_NAMES_EN[r.month].slice(0, 3)} ${r.year}`,
            uptime: r.uptimePercent,
            incidents: r.failedChecks,
        }));

    const monthName = (m: number) => isAr ? MONTH_NAMES_AR[m] : MONTH_NAMES_EN[m];

    return (
        <div className={`space-y-6 ${isAr ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">{isAr ? 'تقارير SLA الشهرية' : 'Monthly SLA Reports'}</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        {isAr ? 'وقت التشغيل ووقت التوقف والأحداث لكل شهر'
                            : 'Uptime, downtime, and incidents per calendar month'}
                    </p>
                </div>
                <Button size="sm" onClick={generateReport} disabled={generating}>
                    <RefreshCw className={`h-4 w-4 me-2 ${generating ? 'animate-spin' : ''}`} />
                    {generating
                        ? (isAr ? 'جاري الإنشاء...' : 'Generating...')
                        : (isAr ? 'إنشاء تقرير هذا الشهر' : 'Generate This Month')}
                </Button>
            </div>

            {/* Current month live card */}
            {current && (
                <Card className={`border ${uptimeBg(current.uptimePercent)}`}>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            {current.uptimePercent >= 99 ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <AlertCircle className="h-5 w-5 text-yellow-500" />
                            )}
                            {isAr ? 'الشهر الحالي (مباشر)' : 'Current Month (Live)'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground">{isAr ? 'وقت التشغيل' : 'Uptime'}</p>
                                <p className={`text-2xl font-bold ${uptimeColor(current.uptimePercent)}`}>
                                    {current.uptimePercent}%
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{isAr ? 'وقت التوقف' : 'Downtime'}</p>
                                <p className="text-2xl font-bold">{current.downtimeMinutes}m</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{isAr ? 'الأحداث' : 'Incidents'}</p>
                                <p className="text-2xl font-bold text-red-500">{current.failedChecks}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">{isAr ? 'متوسط الاستجابة' : 'Avg Response'}</p>
                                <p className="text-2xl font-bold">{current.avgLatencyMs}ms</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Uptime trend chart */}
            {chartData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{isAr ? 'اتجاه وقت التشغيل (آخر 6 أشهر)' : 'Uptime Trend (Last 6 Months)'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} reversed={isAr} />
                                <YAxis domain={[98, 100]} tick={{ fontSize: 11 }} unit="%" />
                                <Tooltip formatter={(v) => [`${v}%`, isAr ? 'وقت التشغيل' : 'Uptime']} />
                                <Bar dataKey="uptime" name="Uptime" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            {/* Historical reports table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">{isAr ? 'التقارير التاريخية' : 'Historical Reports'}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{isAr ? 'جاري التحميل...' : 'Loading...'}</div>
                    ) : reports.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
                            <p>{isAr ? 'لا توجد تقارير. انقر على "إنشاء تقرير هذا الشهر" للبدء.' : 'No reports yet. Click "Generate This Month" to start.'}</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground text-xs uppercase">
                                        <th className="py-2 px-3 text-start">{isAr ? 'الشهر' : 'Month'}</th>
                                        <th className="py-2 px-3 text-start">{isAr ? 'وقت التشغيل' : 'Uptime'}</th>
                                        <th className="py-2 px-3 text-start">{isAr ? 'وقت التوقف' : 'Downtime'}</th>
                                        <th className="py-2 px-3 text-start">{isAr ? 'الأحداث' : 'Incidents'}</th>
                                        <th className="py-2 px-3 text-start">{isAr ? 'متوسط الاستجابة' : 'Avg Response'}</th>
                                        <th className="py-2 px-3 text-start">{isAr ? 'الملخص' : 'Summary'}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map(r => (
                                        <tr key={r.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="py-3 px-3 font-medium">
                                                {monthName(r.month)} {r.year}
                                            </td>
                                            <td className={`py-3 px-3 font-bold ${uptimeColor(r.uptimePercent)}`}>
                                                {r.uptimePercent}%
                                            </td>
                                            <td className="py-3 px-3 text-muted-foreground">
                                                {r.downtimeMinutes > 0 ? `${r.downtimeMinutes}m` : '—'}
                                            </td>
                                            <td className="py-3 px-3">
                                                {r.failedChecks > 0 ? (
                                                    <span className="text-red-500 flex items-center gap-1">
                                                        <TrendingDown className="h-3 w-3" /> {r.failedChecks}
                                                    </span>
                                                ) : (
                                                    <span className="text-green-500">0</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-muted-foreground">{r.avgLatencyMs}ms</td>
                                            <td className="py-3 px-3 text-xs text-muted-foreground">
                                                {r.uptimePercent >= 99.9
                                                    ? (isAr ? 'ممتاز' : 'Excellent')
                                                    : r.uptimePercent >= 99
                                                        ? (isAr ? 'جيد' : 'Good')
                                                        : (isAr ? 'يحتاج تحسين' : 'Needs improvement')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
