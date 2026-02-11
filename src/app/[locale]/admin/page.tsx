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
import { useRouter, useLocale } from '@/i18n/navigation';

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
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button onClick={fetchStats} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: data.stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      href: `/${locale}/admin/users`,
    },
    {
      title: 'Total Companies',
      value: data.stats.totalCompanies,
      icon: Building2,
      color: 'text-green-500',
      href: `/${locale}/admin/companies`,
    },
    {
      title: 'Total Requests',
      value: data.stats.totalRequests,
      icon: FileText,
      color: 'text-purple-500',
      href: `/${locale}/admin/requests`,
    },
    {
      title: 'Total Projects',
      value: data.stats.totalProjects,
      icon: Briefcase,
      color: 'text-orange-500',
      href: `/${locale}/admin/projects`,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform activity</p>
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
        <Card className="border-yellow-500/50 bg-yellow-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">Pending Verifications</p>
                  <p className="text-sm text-muted-foreground">
                    {data.stats.pendingVerifications} companies awaiting verification
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/${locale}/admin/verifications`)}
              >
                Review
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
            <CardTitle className="text-lg">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{user.name || 'Unknown'}</p>
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
            <CardTitle className="text-lg">Recent Requests</CardTitle>
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
                        ? 'bg-green-500'
                        : req.status === 'PENDING'
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
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
