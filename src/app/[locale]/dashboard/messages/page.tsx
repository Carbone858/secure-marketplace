'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Loader2,
  Send,
  Search,
  MessageSquare,
  ChevronLeft,
  Briefcase,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/providers/AuthProvider';

interface ProjectContext {
  id: string;
  title: string;
  status: string;
  companyName: string;
}

interface Conversation {
  partner: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
  projectContext?: ProjectContext | null;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: {
    name: string | null;
    image: string | null;
  };
}

export default function MessagesPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('dashboard_pages.messages');
  const tStatus = useTranslations('company_dashboard.status');
  const { user, isLoading: authLoading } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedProjectContext, setSelectedProjectContext] = useState<ProjectContext | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/auth/login?redirect=${encodeURIComponent(`/${locale}/dashboard/messages`)}`);
      return;
    }

    if (user) {
      const searchParams = new URLSearchParams(window.location.search);
      const withUserId = searchParams.get('with');

      const initialize = async () => {
        await fetchConversations();
        if (withUserId) {
          setSelectedConversation(withUserId);
          fetchMessages(withUserId);
        }
      };

      initialize();
    }
  }, [user, authLoading, locale, router]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
      const interval = setInterval(() => {
        fetchMessages(selectedConversation);
        fetchConversations();
      }, 5000); // Poll every 5s for real-time feel
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const withUserId = searchParams.get('with');
      const url = withUserId ? `/api/messages?ensure=${withUserId}` : '/api/messages';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data.conversations);
      
      // Update selected project context if we have a selection
      if (selectedConversation) {
        const currentConv = data.conversations.find((c: Conversation) => c.partner.id === selectedConversation);
        if (currentConv?.projectContext) {
          setSelectedProjectContext(currentConv.projectContext);
        }
      }
    } catch (err) {
      toast.error(t('toasts.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const response = await fetch(`/api/messages?with=${partnerId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data.messages);
      if (data.contextProject) {
        setSelectedProjectContext(data.contextProject);
      }
    } catch (err) {
      toast.error(t('toasts.messagesFailed'));
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedConversation,
          content: newMessage,
          projectId: selectedProjectContext?.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      setMessages([...messages, data.message]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      toast.error(t('toasts.sendFailed'));
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.partner.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPartner = conversations.find(
    (c) => c.partner.id === selectedConversation
  )?.partner;

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 h-[calc(100vh-80px)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
      </div>

      <Card className="flex-1 overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Conversations List */}
            <div
              className={`w-full md:w-80 border-e flex flex-col shrink-0 ${selectedConversation ? 'hidden md:flex' : 'flex'
                }`}
            >
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-10 h-9"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>{t('noConversations')}</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.partner.id}
                        onClick={() => setSelectedConversation(conv.partner.id)}
                        className={`w-full p-4 flex items-start gap-4 transition-colors hover:bg-muted/50 ${selectedConversation === conv.partner.id ? 'bg-muted' : ''
                          }`}
                      >
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarImage src={conv.partner.image || undefined} />
                          <AvatarFallback>{conv.partner.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0 text-start">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold truncate">{conv.partner.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.lastMessage.content}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="default" className="mt-1 h-5 min-w-[20px] justify-center px-1">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div
              className={`flex-1 flex flex-col min-w-0 ${selectedConversation ? 'flex' : 'hidden md:flex'
                }`}
            >
              {selectedConversation && selectedPartner ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b flex items-center gap-4 shrink-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedConversation(null)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedPartner.image || undefined} />
                      <AvatarFallback>{selectedPartner.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold truncate">{selectedPartner.name}</h2>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        Online
                      </div>
                    </div>
                  </div>

                  {/* Project Context Sidebar/Header */}
                  {selectedProjectContext && (
                    <div className="px-4 py-2 border-b bg-muted/30 flex flex-wrap items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Project:</span>
                        <span className="font-medium text-foreground">{selectedProjectContext.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Company:</span>
                        <span className="font-medium text-foreground">{selectedProjectContext.companyName}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider h-5">
                        {tStatus(selectedProjectContext.status)}
                      </Badge>
                    </div>
                  )}

                  {/* Messages List */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'
                            }`}
                        >
                          <div
                            className={`flex gap-3 max-w-[80%] ${msg.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'
                              }`}
                          >
                            <Avatar className="h-8 w-8 mt-0.5 shrink-0">
                              <AvatarImage src={msg.sender.image || undefined} />
                              <AvatarFallback>{msg.sender.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div
                              className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'
                                }`}
                            >
                              <div
                                className={`rounded-2xl px-4 py-2 text-sm ${msg.senderId === user?.id
                                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                                  : 'bg-muted rounded-tl-none'
                                  }`}
                              >
                                {msg.content}
                              </div>
                              <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Message Input */}
                  <div className="p-4 border-t shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isSending}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('selectConversation')}</h3>
                  <p className="text-muted-foreground max-w-xs">{t('selectConversationDesc')}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
