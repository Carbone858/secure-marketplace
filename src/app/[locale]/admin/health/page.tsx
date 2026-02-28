'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
    Activity, Database, Shield, MessageSquare, Upload, FileText,
    Server, Lock, RefreshCw, Download, AlertTriangle, CheckCircle,
    XCircle, Clock, Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// ── Types ──────────────────────────────────────────────────────────────────────

type HealthStatusType = 'OK' | 'WARNING' | 'CRITICAL';
type FilterType = 'ALL' | 'CRITICAL' | 'WARNING';

interface CategoryStatus {
    status: HealthStatusType;
    latencyMs: number | null;
}

interface HealthLog {
    id: string;
    service: string;
    category: string;
    status: HealthStatusType;
    latencyMs: number | null;
    statusCode: number | null;
    errorMessage: string | null;
    url: string | null;
    retryCount: number;
    testedAt: string;
}

interface DashboardData {
    uptimePercent: number;
    totalChecks: number;
    failedChecks: number;
    avgLatencyMs: number;
    categoryStatus: Record<string, CategoryStatus>;
    recentLogs: HealthLog[];
    latencyTrend: Array<{ time: string; avgMs: number }>;
    errorsByCategory: Array<{ category: string; count: number }>;
}

// ── Feature Widget Config ─────────────────────────────────────────────────────

const FEATURE_WIDGETS = [
    { key: 'AUTH', icon: Lock, labelKey: 'health.features.auth' },
    { key: 'DATABASE', icon: Database, labelKey: 'health.features.database' },
    { key: 'REQUESTS', icon: FileText, labelKey: 'health.features.requests' },
    { key: 'MESSAGING', icon: MessageSquare, labelKey: 'health.features.messaging' },
    { key: 'UPLOADS', icon: Upload, labelKey: 'health.features.uploads' },
    { key: 'API', icon: Server, labelKey: 'health.features.api' },
    { key: 'SECURITY', icon: Shield, labelKey: 'health.features.security' },
    { key: 'CACHE', icon: Activity, labelKey: 'health.features.cache' },
];

// ── Status helpers ────────────────────────────────────────────────────────────

function statusColor(status: HealthStatusType) {
    if (status === 'OK') return 'text-green-500';
    if (status === 'WARNING') return 'text-yellow-500';
    return 'text-red-500';
}

function statusBg(status: HealthStatusType) {
    if (status === 'OK') return 'bg-green-500/10 border-green-500/30';
    if (status === 'WARNING') return 'bg-yellow-500/10 border-yellow-500/30';
    return 'bg-red-500/10 border-red-500/30';
}

function StatusIcon({ status }: { status: HealthStatusType }) {
    if (status === 'OK') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === 'WARNING') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
}

function StatusBadge({ status }: { status: HealthStatusType }) {
    const variants: Record<HealthStatusType, string> = {
        OK: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        WARNING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variants[status]}`}>
            {status}
        </span>
    );
}

// ── Export helpers ────────────────────────────────────────────────────────────

function exportLogs(logs: HealthLog[]) {
    const csv = [
        ['Service', 'Category', 'Status', 'Latency(ms)', 'HTTP', 'Error', 'Tested At'].join(','),
        ...logs.map((l) =>
            [l.service, l.category, l.status, l.latencyMs ?? '', l.statusCode ?? '', `"${l.errorMessage ?? ''}"`, l.testedAt].join(',')
        ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
}

// ── Main Dashboard Component ──────────────────────────────────────────────────

export default function HealthDashboardPage() {
    const t = useTranslations('admin');
    const locale = useLocale();
    const isRTL = locale === 'ar';

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);
    const [filter, setFilter] = useState<FilterType>('ALL');
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/health/status');
            if (!res.ok) throw new Error('Failed to load');
            const json = await res.json();
            setData(json);
            setLastRefresh(new Date());
        } catch {
            toast.error(t('health.loadError'));
        } finally {
            setLoading(false);
        }
    }, [t]);

    // Auto-refresh every 60 seconds
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60_000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const runDiagnostics = async () => {
        setRunning(true);
        try {
            const res = await fetch('/api/admin/health/run', { method: 'POST' });
            const json = await res.json();
            toast.success(`${t('health.diagComplete')}: OK ${json.ok}, ⚠ ${json.warnings}, 🔴 ${json.critical}`);
            await fetchData();
        } catch {
            toast.error(t('health.diagError'));
        } finally {
            setRunning(false);
        }
    };

    const filteredLogs = data?.recentLogs.filter((l) => {
        if (filter === 'ALL') return true;
        if (filter === 'CRITICAL') return l.status === 'CRITICAL';
        if (filter === 'WARNING') return l.status === 'WARNING' || l.status === 'CRITICAL';
        return true;
    }) ?? [];

    const overallStatus: HealthStatusType = !data
        ? 'OK'
        : data.failedChecks === 0
            ? 'OK'
            : data.failedChecks < data.totalChecks * 0.2
                ? 'WARNING'
                : 'CRITICAL';

    return (
        <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-7 w-7 text-primary" />
                        {t('health.title')}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {t('health.subtitle')}
                        {lastRefresh && (
                            <span className="ms-2 opacity-60">
                                · {t('health.lastRefresh')}: {lastRefresh.toLocaleTimeString(locale)}
                            </span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => { setLoading(true); fetchData(); }}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 me-2 ${loading ? 'animate-spin' : ''}`} />
                        {t('health.refresh')}
                    </Button>
                    <Button size="sm" onClick={runDiagnostics} disabled={running}>
                        <Activity className={`h-4 w-4 me-2 ${running ? 'animate-pulse' : ''}`} />
                        {running ? t('health.running') : t('health.runDiag')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => data && exportLogs(data.recentLogs)}
                    >
                        <Download className="h-4 w-4 me-2" />
                        {t('health.export')}
                    </Button>
                </div>
            </div>

            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className={`border ${statusBg(overallStatus)}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('health.overallStatus')}</p>
                                <p className={`text-2xl font-bold ${statusColor(overallStatus)}`}>{overallStatus}</p>
                            </div>
                            <StatusIcon status={overallStatus} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('health.uptime24h')}</p>
                                <p className="text-2xl font-bold text-green-500">{data?.uptimePercent ?? '—'}%</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('health.avgLatency')}</p>
                                <p className="text-2xl font-bold">{data?.avgLatencyMs ?? '—'} ms</p>
                            </div>
                            <Clock className="h-8 w-8 text-blue-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>

                <Card className={data?.failedChecks ? 'border-red-500/30 bg-red-500/5' : ''}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('health.errors24h')}</p>
                                <p className="text-2xl font-bold text-red-500">{data?.failedChecks ?? '—'}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500 opacity-50" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Feature Status Widgets */}
            <div>
                <h2 className="text-lg font-semibold mb-3">{t('health.featureStatus')}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {FEATURE_WIDGETS.map(({ key, icon: Icon, labelKey }) => {
                        const cat = data?.categoryStatus[key];
                        const status: HealthStatusType = (cat?.status as HealthStatusType) ?? 'OK';
                        return (
                            <Card key={key} className={`border text-center p-3 ${statusBg(status)}`}>
                                <div className="flex flex-col items-center gap-1">
                                    <Icon className={`h-6 w-6 ${statusColor(status)}`} />
                                    <span className="text-xs font-medium">{t(labelKey as any)}</span>
                                    <StatusBadge status={status} />
                                    {cat?.latencyMs != null && (
                                        <span className="text-xs text-muted-foreground">{cat.latencyMs}ms</span>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Latency Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('health.latencyTrend')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={data?.latencyTrend ?? []}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(v) => new Date(v).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                                    tick={{ fontSize: 11 }}
                                    reversed={isRTL}
                                />
                                <YAxis tick={{ fontSize: 11 }} unit="ms" />
                                <Tooltip
                                    labelFormatter={(v) => new Date(v).toLocaleString(locale)}
                                    formatter={(v) => [`${v}ms`, t('health.avgLatency')]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="avgMs"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                    name={t('health.avgLatency')}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Errors by Category */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t('health.errorsByCategory')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data?.errorsByCategory ?? []}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="category" tick={{ fontSize: 11 }} reversed={isRTL} />
                                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                <Tooltip formatter={(v) => [v, t('health.errors')]} />
                                <Bar dataKey="count" name={t('health.errors')} fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Logs Table */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <CardTitle className="text-base">{t('health.recentLogs')}</CardTitle>
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            {(['ALL', 'WARNING', 'CRITICAL'] as FilterType[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${filter === f
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'border-input hover:bg-muted'
                                        }`}
                                >
                                    {t(`health.filter.${f.toLowerCase()}` as any)}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">{t('health.loading')}</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-50" />
                            {t('health.noLogs')}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-muted-foreground text-xs uppercase">
                                        <th className="py-2 px-3 text-start">{t('health.col.status')}</th>
                                        <th className="py-2 px-3 text-start">{t('health.col.service')}</th>
                                        <th className="py-2 px-3 text-start">{t('health.col.category')}</th>
                                        <th className="py-2 px-3 text-start">{t('health.col.latency')}</th>
                                        <th className="py-2 px-3 text-start">{t('health.col.http')}</th>
                                        <th className="py-2 px-3 text-start">{t('health.col.error')}</th>
                                        <th className="py-2 px-3 text-start">{t('health.col.time')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log) => (
                                        <tr key={log.id} className="border-b hover:bg-muted/30 transition-colors">
                                            <td className="py-2 px-3">
                                                <div className="flex items-center gap-1.5">
                                                    <StatusIcon status={log.status} />
                                                    <StatusBadge status={log.status} />
                                                </div>
                                            </td>
                                            <td className="py-2 px-3 font-mono text-xs">{log.service}</td>
                                            <td className="py-2 px-3">
                                                <Badge variant="outline" className="text-xs">{log.category}</Badge>
                                            </td>
                                            <td className="py-2 px-3 text-muted-foreground">
                                                {log.latencyMs != null ? `${log.latencyMs}ms` : '—'}
                                            </td>
                                            <td className="py-2 px-3">
                                                {log.statusCode ? (
                                                    <span className={`font-mono text-xs ${log.statusCode >= 400 ? 'text-red-500' : 'text-green-500'}`}>
                                                        {log.statusCode}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-muted-foreground max-w-xs truncate" title={log.errorMessage ?? ''}>
                                                {log.errorMessage ?? '—'}
                                            </td>
                                            <td className="py-2 px-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(log.testedAt).toLocaleString(locale)}
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
