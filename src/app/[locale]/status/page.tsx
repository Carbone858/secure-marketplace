'use client';

import { useState, useEffect } from 'react';
import {
    CheckCircle, AlertTriangle, XCircle, Clock,
    Activity, Database, Lock, MessageSquare,
    Upload, Server, Shield, Zap
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────

type OverallStatus = 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
type ComponentStatus = 'OK' | 'WARNING' | 'CRITICAL';

interface Component {
    status: ComponentStatus;
    latencyMs: number | null;
    lastChecked: string | null;
}

interface Incident {
    id: string;
    service: string;
    category: string;
    message: string | null;
    time: string;
}

interface StatusData {
    status: OverallStatus;
    uptime24h: number;
    checkedAt: string;
    components: Record<string, Component>;
    incidents: Incident[];
}

// ── Config ─────────────────────────────────────────────────────────────────

const COMPONENT_LABELS: Record<string, { label: string; labelAr: string; icon: React.ReactNode }> = {
    AUTH: { label: 'Authentication', labelAr: 'المصادقة', icon: <Lock className="h-5 w-5" /> },
    DATABASE: { label: 'Database', labelAr: 'قاعدة البيانات', icon: <Database className="h-5 w-5" /> },
    API: { label: 'API', labelAr: 'واجهة التطبيق', icon: <Server className="h-5 w-5" /> },
    REQUESTS: { label: 'Service Requests', labelAr: 'الطلبات', icon: <Activity className="h-5 w-5" /> },
    MESSAGING: { label: 'Messaging', labelAr: 'الرسائل', icon: <MessageSquare className="h-5 w-5" /> },
    UPLOADS: { label: 'File Uploads', labelAr: 'رفع الملفات', icon: <Upload className="h-5 w-5" /> },
    SECURITY: { label: 'Security', labelAr: 'الأمن', icon: <Shield className="h-5 w-5" /> },
    CACHE: { label: 'Cache', labelAr: 'التخزين المؤقت', icon: <Zap className="h-5 w-5" /> },
};

// ── Status Helpers ─────────────────────────────────────────────────────────

function overallBg(s: OverallStatus) {
    if (s === 'OPERATIONAL') return 'bg-green-500';
    if (s === 'DEGRADED') return 'bg-yellow-500';
    return 'bg-red-500';
}

function overallLabel(s: OverallStatus, isAr: boolean) {
    const map = {
        OPERATIONAL: { en: 'All Systems Operational', ar: 'جميع الأنظمة تعمل بشكل طبيعي' },
        DEGRADED: { en: 'Partial Service Disruption', ar: 'انقطاع جزئي في الخدمة' },
        DOWN: { en: 'Major Service Outage', ar: 'انقطاع رئيسي في الخدمة' },
    };
    return isAr ? map[s].ar : map[s].en;
}

function ComponentIcon({ status }: { status: ComponentStatus }) {
    if (status === 'OK') return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
    if (status === 'WARNING') return <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
    return <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />;
}

function componentBgClass(s: ComponentStatus) {
    if (s === 'OK') return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30';
    if (s === 'WARNING') return 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/30';
    return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30';
}

function statusLabel(s: ComponentStatus, isAr: boolean) {
    const map = { OK: { en: 'Operational', ar: 'يعمل' }, WARNING: { en: 'Degraded', ar: 'متأثر' }, CRITICAL: { en: 'Outage', ar: 'متوقف' } };
    return isAr ? map[s].ar : map[s].en;
}

function timeAgo(iso: string) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function StatusPage() {
    const [data, setData] = useState<StatusData | null>(null);
    const [loading, setLoading] = useState(true);
    const [lang, setLang] = useState<'en' | 'ar'>('en');
    const isAr = lang === 'ar';

    useEffect(() => {
        // Detect page locale from URL
        const pathLang = window.location.pathname.startsWith('/ar') ? 'ar' : 'en';
        setLang(pathLang);

        const load = () =>
            fetch('/api/status')
                .then(r => r.json())
                .then(d => { setData(d); setLoading(false); })
                .catch(() => setLoading(false));

        load();
        const iv = setInterval(load, 60_000);
        return () => clearInterval(iv);
    }, []);

    return (
        <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"
        >
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        <span className="font-bold text-lg">{isAr ? 'صفحة الحالة' : 'System Status'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setLang(l => l === 'en' ? 'ar' : 'en')}
                            className="text-sm text-muted-foreground hover:text-foreground border rounded-lg px-3 py-1 transition-colors"
                        >
                            {isAr ? 'English' : 'العربية'}
                        </button>
                        {data && (
                            <span className="text-xs text-muted-foreground">
                                {isAr ? 'آخر تحديث' : 'Last updated'}: {timeAgo(data.checkedAt)}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-12 space-y-10">
                {/* Overall status banner */}
                {loading ? (
                    <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ) : data ? (
                    <div className={`rounded-2xl p-8 text-white text-center shadow-lg ${overallBg(data.status)}`}>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            {data.status === 'OPERATIONAL'
                                ? <CheckCircle className="h-10 w-10" />
                                : data.status === 'DEGRADED'
                                    ? <AlertTriangle className="h-10 w-10" />
                                    : <XCircle className="h-10 w-10" />}
                            <h1 className="text-3xl font-bold">{overallLabel(data.status, isAr)}</h1>
                        </div>
                        <p className="text-white/80 text-lg mt-1">
                            {isAr ? 'وقت التشغيل خلال 24 ساعة' : '24h Uptime'}: {data.uptime24h}%
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        {isAr ? 'تعذر تحميل بيانات الحالة' : 'Could not load status data'}
                    </div>
                )}

                {/* Component list */}
                {data && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">{isAr ? 'حالة المكونات' : 'Component Status'}</h2>
                        <div className="space-y-2">
                            {Object.entries(COMPONENT_LABELS).map(([key, meta]) => {
                                const comp = data.components[key];
                                const status: ComponentStatus = (comp?.status as ComponentStatus) ?? 'OK';
                                return (
                                    <div
                                        key={key}
                                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${componentBgClass(status)}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground">{meta.icon}</span>
                                            <span className="font-medium">{isAr ? meta.labelAr : meta.label}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {comp?.latencyMs != null && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {comp.latencyMs}ms
                                                </span>
                                            )}
                                            <ComponentIcon status={status} />
                                            <span className="text-sm font-medium">{statusLabel(status, isAr)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Incidents */}
                {data && (
                    <section>
                        <h2 className="text-xl font-bold mb-4">
                            {isAr ? 'الأحداث الأخيرة (72 ساعة)' : 'Recent Incidents (72h)'}
                        </h2>
                        {data.incidents.length === 0 ? (
                            <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-6 text-center">
                                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <p className="text-green-700 dark:text-green-400 font-medium">
                                    {isAr ? 'لا توجد أحداث في الـ72 ساعة الماضية' : 'No incidents in the last 72 hours'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.incidents.map(inc => (
                                    <div key={inc.id} className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
                                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-medium text-red-800 dark:text-red-300 text-sm">{inc.service}</span>
                                                <span className="text-xs text-red-600 dark:text-red-400 whitespace-nowrap">{timeAgo(inc.time)}</span>
                                            </div>
                                            {inc.message && (
                                                <p className="text-xs text-red-700 dark:text-red-400 mt-1 truncate">{inc.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Footer */}
                <footer className="text-center text-sm text-muted-foreground pt-4 border-t">
                    <p>{isAr ? 'يتم تحديث هذه الصفحة تلقائياً كل دقيقة.' : 'This page refreshes automatically every minute.'}</p>
                    <p className="mt-1 opacity-60">{isAr ? 'مدعوم بمراقبة الصحة في الوقت الفعلي.' : 'Powered by real-time health monitoring.'}</p>
                </footer>
            </main>
        </div>
    );
}
