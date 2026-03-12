'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTranslations, useLocale } from 'next-intl';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';

interface Conversation {
    partner: {
        id: string;
        name: string;
        avatar: string | null;
    };
    lastMessage: {
        content: string;
        senderId: string;
        recipientId: string;
        createdAt: string;
    };
    unreadCount: number;
}

export function MessageIcon({ locale }: { locale: string }) {
    const isRTL = locale === 'ar';
    const dateLocale = isRTL ? ar : enUS;
    const { user } = useAuth();
    
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchMessages = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/messages');
            if (!res.ok) return;
            const data = await res.json();
            
            let totalUnread = 0;
            if (data.conversations && Array.isArray(data.conversations)) {
                data.conversations.forEach((conv: Conversation) => {
                    totalUnread += (conv.unreadCount || 0);
                });
                // Sort by most recent message first
                const sorted = data.conversations.sort((a: Conversation, b: Conversation) => 
                    new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
                );
                setConversations(sorted);
            }
            setUnreadCount(totalUnread);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 60000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    if (!user) return null;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <MessageSquare className="h-5 w-5" />
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
                    <span className="text-base font-semibold">{isRTL ? 'الرسائل' : 'Messages'}</span>
                </DropdownMenuLabel>

                <ScrollArea className="h-[400px]">
                    {isLoading && conversations.length === 0 ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                            <MessageSquare className="h-10 w-10 text-muted-foreground/20 mb-2" />
                            <p className="text-sm text-muted-foreground">
                                {isRTL ? 'لا توجد رسائل' : 'No messages yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {conversations.map((conv) => {
                                const hasUnread = conv.unreadCount > 0;
                                return (
                                    <DropdownMenuItem
                                        key={conv.partner.id}
                                        className={cn(
                                            "p-4 cursor-pointer focus:bg-muted/50 transition-colors flex items-start gap-4",
                                            hasUnread && "bg-primary/5"
                                        )}
                                        onClick={(e) => {
                                            window.location.href = `/${locale}/dashboard/messages?user=${conv.partner.id}`;
                                        }}
                                    >
                                        <div className="flex-shrink-0">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={conv.partner.avatar || undefined} />
                                                <AvatarFallback>{conv.partner.name?.[0] || 'U'}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                        
                                        <div className="flex-1 space-y-1 overflow-hidden">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={cn("text-sm font-medium leading-none line-clamp-1", hasUnread && "text-primary font-bold")}>
                                                    {conv.partner.name}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                                                        addSuffix: true,
                                                        locale: dateLocale
                                                    })}
                                                </span>
                                            </div>
                                            <p className={cn("text-xs line-clamp-2 leading-relaxed", hasUnread ? "text-foreground font-medium" : "text-muted-foreground")}>
                                                {conv.lastMessage.senderId === user.id && (isRTL ? 'أنت: ' : 'You: ')}
                                                {conv.lastMessage.content}
                                            </p>
                                        </div>
                                        
                                        {hasUnread && (
                                            <div className="mt-2 h-5 min-w-5 rounded-full bg-primary flex items-center justify-center px-1.5 flex-shrink-0">
                                                <span className="text-[10px] font-bold text-primary-foreground leading-none">
                                                    {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                                </span>
                                            </div>
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </div>
                    )}
                </ScrollArea>

                <DropdownMenuSeparator className="m-0" />
                <div className="p-2">
                    <Button variant="ghost" className="w-full text-xs h-9 justify-center font-medium" asChild>
                        <Link href={`/${locale}/dashboard/messages`}>
                            {isRTL ? 'عرض كل الرسائل' : 'View all messages'}
                            <ExternalLink className="h-3 w-3 ms-2" />
                        </Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
