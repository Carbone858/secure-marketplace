'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: data.stats.totalProjects,
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      title: 'Active Projects',
      value: data.stats.activeProjects,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      title: 'Completed',
      value: data.stats.completedProjects,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      title: 'Total Offers',
      value: data.stats.totalOffers,
      icon: FileText,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Company Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {data.company.name}</p>
        </div>
        <div className="flex gap-2">
          {!data.membership && (
            <Button
              variant="outline"
              onClick={() => router.push(`/${locale}/membership`)}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade Plan
            </Button>
          )}
          <Button onClick={() => router.push(`/${locale}/company/profile`)}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Membership Status */}
      {data.membership ? (
        <Card className="mb-8 border-green-500/50 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">
                    {data.membership.plan.name} Plan Active
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expires on {new Date(data.membership.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-8 border-yellow-500/50 bg-yellow-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium">No Active Membership</p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to access premium features
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push(`/${locale}/membership`)}
              >
                View Plans
              </Button>
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
              <Star className="h-5 w-5 text-yellow-500" />
              Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">
                {data.stats.averageRating.toFixed(1)}
              </div>
              <div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(data.stats.averageRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on {data.stats.totalReviews} reviews
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Offer Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accepted: {data.stats.acceptedOffers}</span>
                <span>Pending: {data.stats.pendingOffers}</span>
              </div>
              <Progress
                value={
                  data.stats.totalOffers > 0
                    ? (data.stats.acceptedOffers / data.stats.totalOffers) * 100
                    : 0
                }
              />
              <p className="text-sm text-muted-foreground">
                {data.stats.totalOffers > 0
                  ? `${Math.round(
                      (data.stats.acceptedOffers / data.stats.totalOffers) * 100
                    )}% acceptance rate`
                  : 'No offers yet'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Projects</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/${locale}/company/projects`)}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No projects yet
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Client: {project.user?.name}
                      </p>
                    </div>
                    <Badge
                      className={
                        project.status === 'ACTIVE'
                          ? 'bg-green-500'
                          : project.status === 'PENDING'
                          ? 'bg-yellow-500'
                          : 'bg-gray-500'
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Offers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Offers</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/${locale}/company/offers`)}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {data.recentOffers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No offers yet
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium truncate max-w-xs">
                        {offer.request?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {offer.price} {offer.currency}
                      </p>
                    </div>
                    <Badge
                      className={
                        offer.status === 'ACCEPTED'
                          ? 'bg-green-500'
                          : offer.status === 'PENDING'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }
                    >
                      {offer.status}
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
