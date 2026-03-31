'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Briefcase, Loader2, MessageSquare, FileUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CompanyProjectsPage() {
  const locale = useLocale();
  const t = useTranslations('company_dashboard');
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProjects(data.projects || []);
    } catch {
      toast.error(t('projects.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [t]);

  const handleComplete = async (requestId: string) => {
    if (!requestId) return;
    setIsCompleting(requestId);
    try {
      const res = await fetch(`/api/requests/${requestId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to complete project');
      toast.success(data.message || 'Project marked as completed');
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete project');
    } finally {
      setIsCompleting(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            {t('projects.title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('projects.subtitle')}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium tracking-tight">{t('projects.noProjects')}</h3>
            <p className="text-sm text-muted-foreground mt-1">{t('projects.noProjectsDesc')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project: any) => (
            <Card key={project.id} className="card-interactive overflow-hidden">
              <CardContent className="p-4 md:p-6 text-start">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight">{project.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      {t('projects.client', { name: project.user?.name || t('projects.unknown') })}
                    </p>
                  </div>
                  <Badge className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.status === 'ACTIVE' || project.status === 'IN_PROGRESS' ? 'bg-info/10 text-info border-info/20' :
                        project.status === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                        project.status === 'DELIVERED' ? 'bg-purple-600/10 text-purple-600 border-purple-600/20' :
                        project.status === 'UNDER_REVIEW' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        project.status === 'COMPLETED' ? 'bg-success/10 text-success border-success/20' :
                        project.status === 'CANCELLED' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-muted/50'
                  }`}>
                    {t(`status.${project.status}`)}
                  </Badge>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                )}

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 mb-6 text-xs text-muted-foreground overflow-hidden">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col font-start align-start text-start items-start">
                      <span className="font-bold text-foreground">{project._count?.messages || 0}</span>
                      <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{t('projects.messages_count')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/5 text-primary">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col font-start align-start text-start items-start">
                      <span className="font-bold text-foreground">{project._count?.deliveries || 0}</span>
                      <span className="text-[10px] uppercase font-bold tracking-tighter opacity-70">{t('projects.files_count')}</span>
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 pt-2 sm:pt-0 sm:ms-auto text-[10px] font-medium opacity-60">
                    {t('projects.created', { date: new Date(project.createdAt).toLocaleDateString() })}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-4 border-t border-border/50">
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs h-9">
                    <Link href={`/${locale}/requests/${project.requestId}?from=company-projects`}>
                      {t('projects.viewRequest')}
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs h-9">
                    <Link href={`/${locale}/dashboard/messages?with=${project.userId}`}>
                      <MessageSquare className="h-3.5 w-3.5 me-1.5" />
                      {t('projects.messageUser') || 'Message Client'}
                    </Link>
                  </Button>
                  {/* Completion Button */}
                  {['ACTIVE', 'IN_PROGRESS', 'DELIVERED', 'UNDER_REVIEW'].includes(project.status) && project.requestId && (
                    <Button
                      variant={['DELIVERED', 'UNDER_REVIEW'].includes(project.status) ? "outline" : "default"}
                      size="sm"
                      className={`w-full sm:w-auto text-xs h-9 col-span-2 sm:col-span-1 ${['DELIVERED', 'UNDER_REVIEW'].includes(project.status) ? 'opacity-70' : ''}`}
                      onClick={() => handleComplete(project.requestId)}
                      disabled={['DELIVERED', 'UNDER_REVIEW'].includes(project.status) || isCompleting === project.requestId}
                    >
                      {['DELIVERED', 'UNDER_REVIEW'].includes(project.status) ? (
                        <>
                          {project.status === 'DELIVERED' ? t('projects.waitingOnClient') : t('projects.underReview')}
                        </>
                      ) : (
                        <>
                          {isCompleting === project.requestId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin me-1.5" />
                          ) : (
                            <Briefcase className="h-3.5 w-3.5 me-1.5" />
                          )}
                          {t('projects.markAsFinished')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
