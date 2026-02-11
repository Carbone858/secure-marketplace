'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Briefcase, Loader2, MessageSquare, FileUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StatusBadge } from '@/components/ui/composite';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function CompanyProjectsPage() {
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Briefcase className="h-8 w-8" />
          My Projects
        </h1>
        <p className="text-muted-foreground mt-1">Manage your active projects</p>
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
            <p className="text-muted-foreground mt-1">Projects start when your offers are accepted</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Client: {project.user?.name || 'Unknown'}
                    </p>
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {project._count?.messages || 0} messages
                  </span>
                  <span className="flex items-center gap-1">
                    <FileUp className="h-4 w-4" />
                    {project._count?.files || 0} files
                  </span>
                  <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <Link href={`/${locale}/dashboard/requests/${project.requestId}`}>
                    <Button variant="outline" size="sm">View Request</Button>
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
