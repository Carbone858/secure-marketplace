'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Users,
  Building2,
  FileText,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface DashboardStats {
  stats: {
    totalUsers: number;
    totalCompanies: number;
    totalRequests: number;
    totalProjects: number;
    pendingVerifications: number;
  };
  recentUsers: any[];
  recentRequests: any[];
  requestsByStatus: any[];
  companiesByStatus: any[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('admin');
  const [data, setData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setData(data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t('errors.loadFailed')}</p>
        <Button onClick={fetchStats} className="mt-4">
          {t('retry')}
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      title: t('stats.totalUsers'),
      value: data.stats.totalUsers,
      icon: Users,
      color: 'text-info',
      href: `/${locale}/admin/users`,
    },
    {
      title: t('stats.totalCompanies'),
      value: data.stats.totalCompanies,
      icon: Building2,
      color: 'text-success',
      href: `/${locale}/admin/companies`,
    },
    {
      title: t('stats.totalRequests'),
      value: data.stats.totalRequests,
      icon: FileText,
      color: 'text-primary',
      href: `/${locale}/admin/requests`,
    },
    {
      title: t('stats.totalProjects'),
      value: data.stats.totalProjects,
      icon: Briefcase,
      color: 'text-warning',
      href: `/${locale}/admin/projects`,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(card.href)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold mt-1">{card.value}</p>
                </div>
                <card.icon className={`h-8 w-8 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Verifications Alert */}
      {data.stats.pendingVerifications > 0 && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">{t('pendingVerifications.title')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('pendingVerifications.description', { count: data.stats.pendingVerifications })}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/${locale}/admin/verifications`)}
              >
                {t('pendingVerifications.review')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('recentUsers.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{user.name || t('recentUsers.unknown')}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.role === 'COMPANY' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('recentRequests.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium truncate max-w-xs">{req.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {req.category?.name} • {req.user?.name}
                    </p>
                  </div>
                  <Badge
                    className={
                      req.status === 'ACTIVE'
                        ? 'bg-success/10 text-success'
                        : req.status === 'PENDING'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-muted text-muted-foreground'
                    }
                  >
                    {req.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
