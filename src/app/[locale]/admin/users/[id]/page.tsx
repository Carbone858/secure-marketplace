'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { User, Shield, Briefcase, Mail, CheckCircle, ArrowLeft, Clock, AlertTriangle, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLocale, useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/components/providers/AuthProvider';
import { hasPermission } from '@/lib/permissions';
import { useRouter } from 'next/navigation';

const ROLES = ['USER', 'COMPANY', 'ADMIN', 'SUPER_ADMIN'] as const;

export default function AdminUserDetailsPage({ params }: { params: { locale: string; id: string } }) {
  const locale = useLocale();
  const t = useTranslations('admin');
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [targetUser, setTargetUser] = useState<any>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${params.id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTargetUser(data.user);
      setRecentRequests(data.recentRequests || []);
    } catch {
      toast.error('Failed to load user details');
      router.push(`/${locale}/admin/users`);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, locale, router]);

  useEffect(() => { fetchDetails(); }, [fetchDetails]);

  const updateUser = async (updates: any) => {
    if (!hasPermission(currentUser?.permissions, 'manage_staff', currentUser?.role, currentUser?.isStaff)) {
      toast.error('You do not have permission to modify this user.');
      return;
    }

    if (updates.isActive === false && (targetUser.role === 'ADMIN' || targetUser.role === 'SUPER_ADMIN')) {
         if (!confirm('Are you sure you want to ban an administrator account?')) return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, ...updates }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update user');
      }
      toast.success('User updated successfully');
      fetchDetails();
    } catch (err: any) {
      toast.error(err.message || 'Error updating user');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-6"><PageSkeleton /></div>;
  if (!targetUser) return null;

  const canManageStaff = hasPermission(currentUser?.permissions, 'manage_staff', currentUser?.role, currentUser?.isStaff);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/${locale}/admin/users`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <User className="h-8 w-8 text-primary" />
            {targetUser.name || 'Unnamed User'}
            {targetUser.isActive === false && <Badge variant="destructive" className="ml-2">BANNED</Badge>}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Mail className="h-4 w-4" /> {targetUser.email}
            {targetUser.emailVerified && <CheckCircle className="h-4 w-4 text-success" />}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">System Role</p>
                  <Badge variant="outline" className="text-sm">
                    <Shield className="h-3 w-3 mr-1" /> {targetUser.role}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Joined</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {new Date(targetUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {targetUser.staffMember && (
                <div className="pt-4 border-t mt-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Staff Assignment
                  </h3>
                  <div className="bg-muted rounded-md p-3 text-sm">
                    <p><strong>Department:</strong> {targetUser.staffMember.department?.name || 'Unassigned'}</p>
                    <p><strong>Role:</strong> {targetUser.staffMember.role?.name || 'Unassigned'}</p>
                  </div>
                </div>
              )}

              {targetUser.company && (
                <div className="pt-4 border-t mt-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Associated Company
                  </h3>
                  <div className="bg-muted rounded-md p-3 text-sm flex justify-between items-center">
                    <span className="font-medium">{targetUser.company.name}</span>
                    <Badge variant="secondary">{targetUser.company.verificationStatus}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {recentRequests.length > 0 ? (
                <ul className="space-y-3">
                  {recentRequests.map((req: any) => (
                    <li key={req.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="text-sm font-medium">{req.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline">{req.status}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No recent service requests.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Requests</span>
                <span className="font-semibold">{targetUser._count?.requests || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Projects</span>
                <span className="font-semibold">{targetUser._count?.projects || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Reviews Written</span>
                <span className="font-semibold">{targetUser._count?.reviews || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Messages Sent</span>
                <span className="font-semibold">{targetUser._count?.messagesSent || 0}</span>
              </div>
            </CardContent>
          </Card>

          {canManageStaff && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" /> Danger Zone
                </CardTitle>
                <CardDescription>Sensitive account actions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change System Role</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-background disabled:opacity-50"
                    value={targetUser.role}
                    disabled={isUpdating}
                    onChange={(e) => updateUser({ role: e.target.value })}
                  >
                    {ROLES.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-2">
                  {targetUser.isActive !== false ? (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      disabled={isUpdating}
                      onClick={() => updateUser({ isActive: false })}
                    >
                      Ban User Account
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      disabled={isUpdating}
                      onClick={() => updateUser({ isActive: true })}
                    >
                      Unban Account
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
