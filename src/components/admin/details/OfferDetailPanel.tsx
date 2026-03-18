'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  FileText, 
  Paperclip, 
  ExternalLink,
  Mail,
  Clock,
  Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface OfferDetailPanelProps {
  offer: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
}

export function OfferDetailPanel({ offer, open, onOpenChange, locale }: OfferDetailPanelProps) {
  if (!offer) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge variant={offer.status.toLowerCase()}>
                {offer.status}
              </StatusBadge>
              {offer.expiresAt && (
                <Badge variant="outline" className="gap-1 bg-amber-50">
                  <Clock className="h-3 w-3" />
                  Expires {format(new Date(offer.expiresAt), 'MMM dd')}
                </Badge>
              )}
            </div>
            <SheetTitle className="text-2xl">Company Offer</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1 text-primary-500 font-semibold truncate tracking-wider">
              OFFER ID: {offer.id.slice(0, 13).toUpperCase()}...
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Parties Involved */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Briefcase className="h-4 w-4" /> Request
                </div>
                <div>
                  <p className="font-semibold text-sm line-clamp-2">{offer.request?.title || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">ID: {offer.requestId.slice(0, 8)}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                <div className="flex items-center gap-2 text-success font-medium">
                  <Building2 className="h-4 w-4" /> Company
                </div>
                <div>
                  <p className="font-semibold text-sm">{offer.company?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{offer.company?.email}</p>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <section className="bg-primary shadow-sm rounded-2xl p-6 text-primary-foreground relative overflow-hidden group">
              <h3 className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2 flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Offer Pricing
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black">{offer.price}</span>
                <span className="text-xl font-medium opacity-80">{offer.currency || 'USD'}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm opacity-90">
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                  <Clock className="h-4 w-4" /> Est. {offer.estimatedDays} Days
                </div>
                {offer.status === 'ACCEPTED' && (
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 font-bold">
                    WINNING OFFER
                  </div>
                )}
              </div>
              <DollarSign className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </section>

            {/* Pitch / Message Content */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Mail className="h-4 w-4" /> Pitch Message
              </h3>
              <div className="text-base leading-relaxed p-6 rounded-2xl bg-muted/10 border-2 border-dashed border-muted-foreground/20 italic whitespace-pre-wrap">
                "{offer.description || offer.message || 'No description provided.'}"
              </div>
            </section>

            {/* Attachments */}
            {offer.attachments && Array.isArray(offer.attachments) && offer.attachments.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                  <Paperclip className="h-4 w-4" /> Attachments ({offer.attachments.length})
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {offer.attachments.map((file: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-background text-sm group hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium truncate max-w-[200px]">{file.name || `Attachment ${i + 1}`}</span>
                      </div>
                      <Link href={file.url || '#'} target="_blank" className="p-2 hover:bg-muted rounded-lg transition-colors">
                        <ExternalLink className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Stats Summary */}
            <div className="pt-6 border-t space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Original Request:</span>
                <Link href={`/${locale}/admin/requests`} className="text-primary font-medium flex items-center gap-1 hover:underline">
                  {offer.request?.title} <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Submitted At:</span>
                <span className="font-medium">{format(new Date(offer.createdAt), 'MMM dd, yyyy HH:mm')}</span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
