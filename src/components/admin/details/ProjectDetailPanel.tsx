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
  Calendar, 
  DollarSign, 
  MapPin, 
  User, 
  Building2, 
  Briefcase, 
  Activity,
  FileText,
  Clock,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

interface ProjectDetailPanelProps {
  project: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale: string;
}

export function ProjectDetailPanel({ project, open, onOpenChange, locale }: ProjectDetailPanelProps) {
  if (!project) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge variant={project.status.toLowerCase()}>
                {project.status.replace('_', ' ')}
              </StatusBadge>
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                {project.progress}% Complete
              </Badge>
            </div>
            <SheetTitle className="text-2xl">{project.title}</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">Project ID: {project.id}</p>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Parties Involved */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <User className="h-4 w-4" /> Client
                </div>
                <div>
                  <p className="font-semibold text-sm">{project.user?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{project.user?.email}</p>
                </div>
              </div>
              <div className="p-4 rounded-xl border bg-muted/10 space-y-3">
                <div className="flex items-center gap-2 text-success font-medium">
                  <Building2 className="h-4 w-4" /> Company
                </div>
                <div>
                  <p className="font-semibold text-sm">{project.company?.name || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{project.company?.email}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" /> Description
              </h3>
              <div className="text-sm leading-relaxed p-4 rounded-lg bg-muted/20 border whitespace-pre-wrap">
                {project.description || 'No description provided.'}
              </div>
            </section>

            {/* Financials & Timeline */}
            <div className="grid grid-cols-2 gap-6">
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Financials
                </h3>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{project.budget ? `${project.budget} ${project.currency}` : 'No Budget Set'}</p>
                  <p className="text-xs text-muted-foreground">Original Offer: {project.budget} {project.currency}</p>
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Timeline
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Started:</span>
                    <span>{project.startDate ? format(new Date(project.startDate), 'MMM dd, yyyy') : 'Pending'}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Est. End:</span>
                    <span>{project.endDate ? format(new Date(project.endDate), 'MMM dd, yyyy') : 'Ongoing'}</span>
                  </p>
                </div>
              </section>
            </div>

            {/* Milestones */}
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Milestones ({project.milestones?.length || 0})
              </h3>
              <div className="space-y-3">
                {project.milestones && project.milestones.length > 0 ? (
                  project.milestones.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-background text-sm">
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${m.status === 'COMPLETED' ? 'bg-success' : 'bg-muted'}`} />
                        <span>{m.title}</span>
                      </div>
                      <Badge variant={m.status === 'COMPLETED' ? 'default' : 'secondary'}>{m.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic text-center py-4 border rounded-lg border-dashed">No milestones tracked.</p>
                )}
              </div>
            </section>

            {/* Related Request */}
            {project.requestId && (
              <section className="pt-4 border-t">
                <Link href={`/${locale}/admin/requests`} className="flex items-center justify-between p-4 rounded-xl border bg-primary/5 hover:bg-primary/10 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <p className="font-semibold">Original Request</p>
                      <p className="text-muted-foreground">View request details and requirements</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </section>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
