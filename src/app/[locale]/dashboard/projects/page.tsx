'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Briefcase, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';

export default function UserProjectsPage() {
  const locale = useLocale();
  const t = useTranslations('dashboard_pages.projects');
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
      toast.error(t('toasts.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      ACTIVE: 'active',
      PENDING: 'pending',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      ON_HOLD: 'warning',
    };
    return <StatusBadge variant={variants[status] || 'neutral'}>{status.replace('_', ' ')}</StatusBadge>;
  };

  const isRTL = locale === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t('noProjects')}</h3>
            <p className="text-muted-foreground mt-1">
              {t('noProjectsDescription')}
            </p>
            <Link href={`/${locale}/requests/new`}>
              <Button className="mt-4">{t('createRequest')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('company')}{project.company?.nameEn || project.company?.nameAr || t('unknown')}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Link href={`/${locale}/dashboard/messages?with=${project.company.userId}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {isRTL ? 'تواصل مع الشركة' : 'Message Company'}
                    </Button>
                  </Link>

                  {/* Completion Button */}
                  {project.status === 'ACTIVE' && project.request?.id && (
                    <Button
                      variant={project.completedByUser ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleComplete(project.request.id)}
                      disabled={project.completedByUser || isCompleting === project.request.id}
                    >
                      {project.completedByUser
                        ? (isRTL ? 'في انتظار الشركة' : 'Waiting on Company')
                        : (isRTL ? 'تحديد كمكتمل' : 'Mark Completed')
                      }
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
