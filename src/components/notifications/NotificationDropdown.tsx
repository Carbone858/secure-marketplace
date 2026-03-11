'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Loader2, Info, AlertTriangle, CheckCircle2, MoreHorizontal, ExternalLink } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    link?: string;
}

export function NotificationDropdown() {
    const t = useTranslations('');
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const dateLocale = isRTL ? ar : enUS;

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/notifications?limit=10');
            if (!res.ok) throw new Error();
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Initial badge count check
        const interval = setInterval(fetchNotifications, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: [id] }),
            });
            if (res.ok) {
                setNotifications(prev =>
                    prev.map(n => n.id === id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const res = await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAll: true }),
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
                toast.success(isRTL ? 'تم تحديد الكل كمقروء' : 'All marked as read');
            }
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle2 className="h-4 w-4 text-success" />;
            case 'WARNING': return <AlertTriangle className="h-4 w-4 text-warning" />;
            case 'INFO': return <Info className="h-4 w-4 text-blue-500" />;
            default: return <Bell className="h-4 w-4 text-muted-foreground" />;
        }
    };

    useEffect(() => {
        if (open && unreadCount > 0) {
            setUnreadCount(0);
        }
    }, [open, unreadCount]);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-bold leading-none animate-in zoom-in">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align={isRTL ? 'start' : 'end'} 
                className="w-[calc(100vw-2rem)] sm:w-80 md:w-96 p-0 overflow-hidden fixed top-16 right-4 sm:absolute sm:top-auto sm:right-0"
            >
                <DropdownMenuLabel className="p-4 flex items-center justify-between border-b">
                    <span className="text-base font-semibold">{isRTL ? 'الإشعارات' : 'Notifications'}</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs text-primary hover:text-primary/80 px-2"
                            onClick={markAllAsRead}
                        >
                            <Check className="h-3 w-3 me-1" />
                            {isRTL ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                        </Button>
                    )}
                </DropdownMenuLabel>

                <ScrollArea className="h-[400px]">
                    {isLoading && notifications.length === 0 ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <Bell className="h-10 w-10 text-muted-foreground/20 mb-2" />
                            <p className="text-sm text-muted-foreground">
                                {isRTL ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={cn(
                                        "p-4 cursor-pointer focus:bg-muted/50 transition-colors flex items-start gap-4",
                                        !notification.isRead && "bg-primary/5"
                                    )}
                                    // @ts-ignore
                                    onClick={(e) => {
                                        if (!notification.isRead) markAsRead(notification.id);
                                        if (notification.link) {
                                            window.location.href = notification.link;
                                        }
                                    }}
                                >
                                    <div className="mt-1 h-8 w-8 rounded-full bg-background border flex items-center justify-center flex-shrink-0">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1 overflow-hidden">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={cn("text-sm font-medium leading-none line-clamp-1", !notification.isRead && "text-primary")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                    locale: dateLocale
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.isRead && (
                                        <div className="mt-2 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <DropdownMenuSeparator className="m-0" />
                <div className="p-2">
                    <Button variant="ghost" className="w-full text-xs h-9 justify-center font-medium" asChild>
                        <Link href={`/${locale}/dashboard/notifications`}>
                            {isRTL ? 'عرض كل الإشعارات' : 'View all notifications'}
                            <ExternalLink className="h-3 w-3 ms-2" />
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
