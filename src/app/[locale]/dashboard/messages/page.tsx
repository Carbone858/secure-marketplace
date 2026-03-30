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
  const lastMessageIdRef = useRef<string | null>(null);

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
        fetchMessages(selectedConversation, false); // Poll without forcing scroll unless new
        fetchConversations();
      }, 5000); 
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    // Only scroll to bottom if the last message has changed
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.id !== lastMessageIdRef.current) {
        scrollToBottom();
        lastMessageIdRef.current = lastMsg.id;
    }
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
      
      if (selectedConversation) {
        const currentConv = data.conversations.find((c: Conversation) => c.partner.id === selectedConversation);
        if (currentConv?.projectContext) {
          setSelectedProjectContext(currentConv.projectContext);
        }
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string, forceScroll = true) => {
    try {
      const response = await fetch(`/api/messages?with=${partnerId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      
      setMessages(data.messages);
      if (data.contextProject) {
        setSelectedProjectContext(data.contextProject);
      }
      
      if (forceScroll) {
          // Reset ref to force scroll on initial load or manual click
          lastMessageIdRef.current = null;
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
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
      // Force scroll for user's own sent message
      lastMessageIdRef.current = null;
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
      <div className="flex items-center justify-center h-[calc(100dvh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="messages-page-active flex flex-col h-[calc(100dvh-64px)] overflow-hidden bg-background">
      {/* Header section is compact */}
      <div className="px-4 py-3 border-b flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold leading-none">{t('title')}</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <aside
          className={`w-full md:w-72 lg:w-80 border-e flex flex-col shrink-0 bg-muted/10 ${selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
        >
          <div className="p-3 border-b shrink-0">
            <div className="relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-10 h-9 bg-background"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="text-sm">{t('noConversations')}</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.partner.id}
                    onClick={() => {
                        setSelectedConversation(conv.partner.id);
                        fetchMessages(conv.partner.id, true);
                    }}
                    className={`w-full p-3 flex items-start gap-3 transition-colors hover:bg-muted/50 ${selectedConversation === conv.partner.id ? 'bg-muted shadow-inner' : ''
                      }`}
                  >
                    <Avatar className="h-10 w-10 shrink-0 border border-background shadow-sm">
                      <AvatarImage src={conv.partner.image || undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{conv.partner.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-start">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm truncate">{conv.partner.name}</span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(conv.lastMessage.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate leading-relaxed">
                        {conv.lastMessage.content || 'No messages yet'}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="default" className="mt-1.5 h-4 min-w-[16px] justify-center px-1 text-[9px] font-bold">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </aside>

        {/* Chat Area */}
        <main
          className={`flex-1 flex flex-col min-w-0 bg-background ${selectedConversation ? 'flex' : 'hidden md:flex'
            }`}
        >
          {selectedConversation && selectedPartner ? (
            <>
              {/* Chat Header */}
              <div className="p-2.5 border-b flex items-center gap-3 shrink-0 bg-background/95 backdrop-blur-sm z-10 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="relative">
                    <Avatar className="h-9 w-9 border shadow-sm">
                      <AvatarImage src={selectedPartner.image || undefined} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">{selectedPartner.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500 shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-sm truncate leading-none mb-0.5">{selectedPartner.name}</h2>
                  <span className="text-[10px] text-muted-foreground">Active now</span>
                </div>
              </div>

              {/* Project Context (Integrated) */}
              {selectedProjectContext && (
                <div className="px-4 py-1.5 border-b bg-muted/20 flex items-center gap-4 shrink-0 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                    <Briefcase className="h-3 w-3 text-primary" />
                    <span className="text-muted-foreground">Project:</span>
                    <span className="font-bold text-foreground">{selectedProjectContext.title}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] whitespace-nowrap">
                    <Building2 className="h-3 w-3 text-primary" />
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-bold text-foreground">{selectedProjectContext.companyName}</span>
                  </div>
                  <Badge variant="secondary" className="text-[9px] uppercase font-bold h-4 px-1 flex-none ml-auto">
                    {tStatus(selectedProjectContext.status)}
                  </Badge>
                </div>
              )}

              {/* Messages List */}
              <ScrollArea className="flex-1 px-4 py-2">
                <div className="space-y-4 py-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                    >
                      <div
                        className={`flex gap-2 max-w-[85%] sm:max-w-[75%] ${msg.senderId === user?.id ? 'flex-row-reverse' : 'flex-row'
                          }`}
                      >
                        <Avatar className="h-7 w-7 mt-0.5 shrink-0 border border-background shadow-sm">
                          <AvatarImage src={msg.sender.image || undefined} />
                          <AvatarFallback className="text-[10px] font-bold">{msg.sender.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex flex-col ${msg.senderId === user?.id ? 'items-end' : 'items-start'
                            }`}
                        >
                          <div
                            className={`rounded-2xl px-3.5 py-2 text-sm shadow-sm leading-relaxed ${msg.senderId === user?.id
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted/80 backdrop-blur-sm rounded-tl-none text-foreground'
                              }`}
                          >
                            {msg.content}
                          </div>
                          <span className="text-[9px] text-muted-foreground mt-1 px-1 font-medium opacity-70">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </ScrollArea>

              {/* Message Input (Always at bottom) */}
              <div className="p-3 border-t bg-background shrink-0 mt-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                  }}
                  className="flex gap-2 items-center"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isSending}
                    className="flex-1 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary h-10 rounded-full px-4 text-sm"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isSending || !newMessage.trim()} 
                    className="rounded-full h-10 w-10 shrink-0 shadow-md"
                   >
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
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-muted/5">
              <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 shadow-sm">
                <MessageSquare className="h-8 w-8 text-primary/40" />
              </div>
              <h3 className="text-lg font-bold mb-1">{t('selectConversation')}</h3>
              <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">{t('selectConversationDesc')}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
