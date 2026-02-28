'use client';

/**
 * LiveErrorsPanel.tsx
 * Real-time panel showing user-triggered backend errors in the last 24 hours.
 * Used in the admin Health Dashboard.
 * Source: "user" = real user action caused the error (vs synthetic check).
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { AlertCircle, RefreshCw, User, Bot, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ── Types ──────────────────────────────────────────────────────────────────

interface AppError {
    id: string;
    service: string;
    category: string;
    status: string;
    errorMessage: string | null;
    testedAt: string;
    details: string | null;
    source: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ago`;
}

const CATEGORY_COLORS: Record<string, string> = {
    AUTH: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    REQUESTS: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    MESSAGING: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    UPLOADS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    DATABASE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    SECURITY: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
    API: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
    CACHE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

// ── Component ──────────────────────────────────────────────────────────────

export default function LiveErrorsPanel() {
    const locale = useLocale();
    const isAr = locale === 'ar';

    const [errors, setErrors] = useState<AppError[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchErrors = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);

        try {
            const res = await fetch('/api/admin/health/errors');
            const json = await res.json();
            setErrors(json.errors || []);
            setTotal(json.total || 0);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchErrors();
        const iv = setInterval(() => fetchErrors(true), 60_000);
        return () => clearInterval(iv);
    }, [fetchErrors]);

    const t = (en: string, ar: string) => isAr ? ar : en;

    return (
        <Card className="border-red-200 dark:border-red-900/50">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        {t('Live Application Errors', 'أخطاء التطبيق المباشرة')}
                        {total > 0 && (
                            <Badge variant="destructive" className="text-xs">{total}</Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            {t('Last 24 hours', 'آخر 24 ساعة')}
                        </span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => fetchErrors(true)}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-red-400" />
                        {t('User-triggered failure', 'خطأ من مستخدم')}
                    </span>
                    <span className="flex items-center gap-1">
                        <Bot className="h-3 w-3 text-blue-400" />
                        {t('Synthetic check', 'فحص آلي')}
                    </span>
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-14 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                        ))}
                    </div>
                ) : errors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <XCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                        <p className="text-sm font-medium text-green-600 dark:text-green-400">
                            {t('No user-triggered errors in the last 24 hours 🎉', 'لا توجد أخطاء مستخدم في آخر 24 ساعة 🎉')}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {errors.map(err => (
                            <div
                                key={err.id}
                                className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20"
                            >
                                {/* Source icon */}
                                <div className="flex-shrink-0 mt-0.5">
                                    {err.source === 'user'
                                        ? <User className="h-4 w-4 text-red-400" />
                                        : <Bot className="h-4 w-4 text-blue-400" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center flex-wrap gap-2 mb-1">
                                        <span className="font-mono text-xs font-semibold text-red-700 dark:text-red-300">
                                            {err.service}
                                        </span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[err.category] ?? CATEGORY_COLORS.API}`}>
                                            {err.category}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground ms-auto">
                                            {timeAgo(err.testedAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-red-600 dark:text-red-400 truncate">
                                        {err.errorMessage ?? t('Unknown error', 'خطأ غير محدد')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Classification guide */}
                <div className="mt-4 pt-3 border-t border-dashed">
                    <p className="text-xs text-muted-foreground font-medium mb-1">
                        {t('Error Classification Guide', 'دليل تصنيف الأخطاء')}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                        <div className="space-y-1">
                            <p className="font-medium text-green-600 dark:text-green-400">
                                {t('✅ Expected (not logged)', '✅ متوقع (لا يُسجَّل)')}
                            </p>
                            <p>• {t('Validation errors (400)', 'أخطاء التحقق (400)')}</p>
                            <p>• {t('Auth failures (401)', 'تسجيل الدخول (401)')}</p>
                            <p>• {t('Permission denied (403)', 'رفض الصلاحية (403)')}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="font-medium text-red-600 dark:text-red-400">
                                {t('🔴 System failures (logged)', '🔴 أعطال النظام (مسجَّلة)')}
                            </p>
                            <p>• {t('Unhandled exceptions (500)', 'أخطاء غير متوقعة (500)')}</p>
                            <p>• {t('Database constraint errors', 'أخطاء قاعدة البيانات')}</p>
                            <p>• {t('External service crashes', 'أعطال الخدمات الخارجية')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
