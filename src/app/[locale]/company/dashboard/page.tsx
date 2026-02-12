'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import {
  Loader2,
  Briefcase,
  FileText,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/components/providers/AuthProvider';

interface DashboardData {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalOffers: number;
    acceptedOffers: number;
    pendingOffers: number;
    totalReviews: number;
    averageRating: number;
  };
  recentProjects: any[];
  recentOffers: any[];
  membership: any;
  company: {
    id: string;
    name: string;
    verificationStatus: string;
    logo: string | null;
  };
}

export default function CompanyDashboardPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('company_dashboard');
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/company/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const result = await response.json();
      setData(result);
    } catch (err) {
      toast.error(t('loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">{t('noData')}</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          {t('retry')}
        </Button>
      </div>
    );
  }

  const statCards = [
    { title: t('stats.totalProjects'), value: data.stats.totalProjects, icon: Briefcase, color: 'text-primary' },
    { title: t('stats.activeProjects'), value: data.stats.activeProjects, icon: Clock, color: 'text-warning' },
    { title: t('stats.completed'), value: data.stats.completedProjects, icon: CheckCircle, color: 'text-success' },
    { title: t('stats.totalOffers'), value: data.stats.totalOffers, icon: FileText, color: 'text-info' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('welcome', { name: data.company.name })}</p>
        </div>
        <div className="flex gap-2">
          {!data.membership && (
            <Button variant="outline" onClick={() => router.push(`/${locale}/membership`)}>
              <Crown className="h-4 w-4 me-2" />
              {t('upgradePlan')}
            </Button>
          )}
          <Button onClick={() => router.push(`/${locale}/company/dashboard/profile`)}>
            {t('editProfile')}
          </Button>
        </div>
      </div>

      {/* Membership Status */}
      {data.membership ? (
        <Card className="mb-8 border-success/50 bg-success/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">{t('membership.planActive', { plan: data.membership.plan.name })}</p>
                  <p className="text-sm text-muted-foreground">{t('membership.expiresOn', { date: new Date(data.membership.endDate).toLocaleDateString() })}</p>
                </div>
              </div>
              <Badge className="bg-success">{t('membership.active')}</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-warning/50 bg-warning/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-warning" />
                <div>
                  <p className="font-medium">{t('membership.noMembership')}</p>
                  <p className="text-sm text-muted-foreground">{t('membership.upgradeDescription')}</p>
                </div>
              </div>
              <Button onClick={() => router.push(`/${locale}/membership`)}>{t('membership.viewPlans')}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <Card key={card.title}>
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

      {/* Rating & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              {t('stats.rating')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{data.stats.averageRating.toFixed(1)}</div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(data.stats.averageRating) ? 'fill-warning text-warning' : 'text-muted-foreground/40'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{t('stats.basedOnReviews', { count: data.stats.totalReviews })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              {t('stats.offerSuccessRate')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t('stats.accepted', { count: data.stats.acceptedOffers })}</span>
                <span>{t('stats.pending', { count: data.stats.pendingOffers })}</span>
              </div>
              <Progress value={data.stats.totalOffers > 0 ? (data.stats.acceptedOffers / data.stats.totalOffers) * 100 : 0} />
              <p className="text-sm text-muted-foreground">
                {data.stats.totalOffers > 0
                  ? t('stats.acceptanceRate', { rate: Math.round((data.stats.acceptedOffers / data.stats.totalOffers) * 100) })
                  : t('stats.noOffers')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('recent.recentProjects')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/company/dashboard/projects`)}>
              {t('recent.viewAll')}
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">{t('recent.noProjects')}</p>
            ) : (
              <div className="space-y-4">
                {data.recentProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{t('recent.client', { name: project.user?.name || '' })}</p>
                    </div>
                    <Badge className={project.status === 'ACTIVE' ? 'bg-success' : project.status === 'PENDING' ? 'bg-warning' : 'bg-muted'}>
                      {t(`status.${project.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('recent.recentOffers')}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => router.push(`/${locale}/company/dashboard/offers`)}>
              {t('recent.viewAll')}
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentOffers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">{t('recent.noOffers')}</p>
            ) : (
              <div className="space-y-4">
                {data.recentOffers.map((offer: any) => (
                  <div key={offer.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium truncate max-w-xs">{offer.request?.title}</p>
                      <p className="text-sm text-muted-foreground">{offer.price} {offer.currency}</p>
                    </div>
                    <Badge className={offer.status === 'ACCEPTED' ? 'bg-success' : offer.status === 'PENDING' ? 'bg-warning' : 'bg-destructive'}>
                      {t(`status.${offer.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
