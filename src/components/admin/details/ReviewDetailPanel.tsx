'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  User, 
  Building2, 
  Activity, 
  Quote, 
  Trash2,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ReviewDetailPanelProps {
  review: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
  onApprove?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ReviewDetailPanel({ 
  review, 
  open, 
  onOpenChange, 
  locale,
  onApprove,
  onDelete
}: ReviewDetailPanelProps) {
  if (!review) return null;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-6 w-6 ${i <= rating ? 'fill-warning text-warning' : 'text-muted-foreground/30'}`}
          />
        ))}
        <span className="ml-2 text-2xl font-bold">{review.rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={review.isApproved ? 'default' : 'secondary'} className="gap-1 px-3 py-1">
                {review.isApproved ? <ShieldCheck className="h-3 w-3" /> : <Clock className="h-3 w-3 text-amber-500" />}
                {review.isApproved ? 'Approved & Public' : 'Pending Moderation'}
              </Badge>
              <Badge variant="outline" className="bg-muted text-xs">REVIEW ID: {review.id.slice(0, 8)}</Badge>
            </div>
            <SheetTitle className="text-2xl font-bold">Client Review Feedback</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1 tracking-tight">
              Submitted on {format(new Date(review.createdAt), 'MMMM dd, yyyy')}
            </p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Parties Focused Section */}
            <div className="p-6 rounded-2xl border bg-gradient-to-br from-primary/5 via-transparent to-success/5 shadow-inner">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                    <User className="h-3 w-3" /> Author
                  </div>
                  <p className="font-semibold text-lg">{review.user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-muted-foreground font-mono">{review.user?.email}</p>
                </div>
                <div className="h-12 w-[1px] bg-muted-foreground/20 rotate-12" />
                <div className="flex-1 space-y-2 text-right">
                  <div className="flex items-center gap-2 text-success font-bold text-xs uppercase tracking-widest justify-end">
                    <Building2 className="h-3 w-3" /> Target Company
                  </div>
                  <p className="font-semibold text-lg">{review.company?.name || 'Unknown Company'}</p>
                  <p className="text-xs text-muted-foreground font-mono">{review.company?.email}</p>
                </div>
              </div>
            </div>

            {/* Rating Display */}
            <section className="bg-muted/10 p-6 rounded-2xl border-2 border-muted border-dashed">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Star className="h-3 w-3" /> Star Rating
              </h3>
              {renderStars(review.rating)}
            </section>

            {/* Full Comment */}
            <section className="relative">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Quote className="h-4 w-4" /> Full Comment Content
              </h3>
              <div className="text-lg leading-relaxed font-sans text-foreground/90 p-8 rounded-2xl bg-muted/5 border-l-4 border-primary/40 shadow-sm relative">
                <Quote className="absolute top-4 left-4 h-12 w-12 text-primary/10 -scale-x-100 rotate-12" />
                <p className="relative z-10 italic">
                  {review.comment || 'No comment provided with this rating.'}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> Authenticated via project ID: {review.projectId?.slice(0, 12)}...
                </div>
              </div>
            </section>

            {/* Project Context Link */}
            {review.project && (
              <section className="pt-4 border-t">
                <Link href={`/${locale}/admin/projects`} className="flex items-center justify-between p-4 rounded-xl border bg-success/5 hover:bg-success/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-success" />
                    <div className="text-sm">
                      <p className="font-semibold">Review of Project</p>
                      <p className="text-muted-foreground">{review.project?.title}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-success opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </section>
            )}
            
            {/* Admin Quick Actions */}
            {!review.isApproved && onApprove && (
              <Button 
                className="w-full bg-success hover:bg-success/90 text-white gap-2 py-6 rounded-2xl shadow-lg"
                onClick={() => onApprove(review.id)}
              >
                <CheckCircle className="h-5 w-5" />
                Approve Review
              </Button>
            )}
            
            {onDelete && (
              <Button 
                variant="outline"
                className="w-full text-red-500 border-red-200 hover:bg-red-50 gap-2 p-6 rounded-2xl"
                onClick={() => onDelete(review.id)}
              >
                <Trash2 className="h-5 w-5" />
                Delete Permanently
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
