'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

const TYPE_COLORS: Record<string, string> = {
    MESSAGE: 'bg-blue-500/10 text-blue-600',
    PROJECT: 'bg-green-500/10 text-green-600',
    OFFER: 'bg-yellow-500/10 text-yellow-600',
    REQUEST: 'bg-purple-500/10 text-purple-600',
    SYSTEM: 'bg-gray-500/10 text-gray-600',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/notifications?limit=50');
            if (!res.ok) throw new Error('Failed to load notifications');
            const data = await res.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) {
            setError('Could not load notifications. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ markAll: true }),
        });
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const markOneRead = async (id: string) => {
        await fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: [id] }),
        });
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const deleteNotification = async (id: string) => {
        await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const deleteAll = async () => {
        await fetch('/api/notifications?all=true', { method: 'DELETE' });
        setNotifications([]);
        setUnreadCount(0);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <Bell className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {unreadCount} unread
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchNotifications}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    {unreadCount > 0 && (
                        <Button variant="outline" size="sm" onClick={markAllRead}>
                            <CheckCheck className="h-4 w-4 mr-1" />
                            Mark all read
                        </Button>
                    )}
                    {notifications.length > 0 && (
                        <Button variant="outline" size="sm" onClick={deleteAll} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Clear all
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-card rounded-xl p-4 animate-pulse">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-xl bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-1/3" />
                                    <div className="h-3 bg-muted rounded w-2/3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="bg-destructive/10 text-destructive rounded-xl p-6 text-center">
                    <p className="font-medium">{error}</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={fetchNotifications}>
                        Try again
                    </Button>
                </div>
            )}

            {!loading && !error && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Bell className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No notifications yet</p>
                    <p className="text-sm">You'll see your notifications here when you receive them.</p>
                </div>
            )}

            {!loading && !error && notifications.length > 0 && (
                <div className="space-y-2">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`relative bg-card rounded-xl p-4 shadow-sm border transition-colors ${!notification.isRead ? 'border-primary/30 bg-primary/5' : 'border-transparent'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Type badge */}
                                <div
                                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${TYPE_COLORS[notification.type] || 'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {notification.type.charAt(0)}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`font-semibold text-sm ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {notification.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                                            {formatDate(notification.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 mt-3 justify-end">
                                {!notification.isRead && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => markOneRead(notification.id)}
                                    >
                                        <CheckCheck className="h-3 w-3 mr-1" />
                                        Mark read
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-destructive hover:text-destructive"
                                    onClick={() => deleteNotification(notification.id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Unread indicator */}
                            {!notification.isRead && (
                                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
