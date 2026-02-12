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

  useEffect(() => {
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
    fetchProjects();
  }, [t]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          {t('projects.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('projects.subtitle')}</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">{t('projects.noProjects')}</h3>
            <p className="text-muted-foreground mt-1">{t('projects.noProjectsDesc')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project: any) => (
            <Card key={project.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('projects.client', { name: project.user?.name || t('projects.unknown') })}
                    </p>
                  </div>
                  <Badge className={
                    project.status === 'ACTIVE' ? 'bg-success' :
                    project.status === 'PENDING' ? 'bg-warning' :
                    project.status === 'COMPLETED' ? 'bg-primary' :
                    project.status === 'CANCELLED' ? 'bg-destructive' : 'bg-muted'
                  }>
                    {t(`status.${project.status}`)}
                  </Badge>
                </div>

                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {t('projects.messages', { count: project._count?.messages || 0 })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileUp className="h-4 w-4" />
                    {t('projects.files', { count: project._count?.files || 0 })}
                  </span>
                  <span>{t('projects.created', { date: new Date(project.createdAt).toLocaleDateString() })}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/${locale}/dashboard/requests/${project.requestId}`}>
                    <Button variant="outline" size="sm">{t('projects.viewRequest')}</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
