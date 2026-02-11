'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Briefcase, Loader2, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function UserProjectsPage() {
  const locale = useLocale();
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
        toast.error('Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          My Projects
        </h1>
        <p className="text-muted-foreground mt-1">Track your active and completed projects</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-muted-foreground mt-1">
              Projects are created when you accept an offer on your request
            </p>
            <Link href={`/${locale}/requests/new`}>
              <Button className="mt-4">Create a Request</Button>
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
                      Company: {project.company?.nameEn || project.company?.nameAr || 'Unknown'}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {project._count?.messages || 0} messages
                  </span>
                  <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
