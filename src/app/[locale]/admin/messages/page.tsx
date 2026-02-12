'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';

export default function AdminMessagesPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages?limit=50');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        // Internal messages may not have a dedicated endpoint yet
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const getPriorityColor = (priority: string) => {
    const variants: Record<string, string> = {
      HIGH: 'error',
      MEDIUM: 'warning',
      LOW: 'success',
    };
    return variants[priority] || 'neutral';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8" />
          {t('sidebar.messages')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('messages_mgmt.subtitle')}</p>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t('messages_mgmt.noMessages')}</h3>
            <p className="text-muted-foreground mt-1">{t('messages_mgmt.noMessagesDescription')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <Card key={msg.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{msg.subject || t('messages_mgmt.noSubject')}</p>
                      {msg.priority && (
                        <StatusBadge variant={getPriorityColor(msg.priority)}>{msg.priority}</StatusBadge>
                      )}
                      {!msg.isRead && <Badge variant="default" className="text-xs">{t('messages_mgmt.new')}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{t('messages_mgmt.from')} {msg.sender?.name || msg.sender?.email || '—'}</span>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
