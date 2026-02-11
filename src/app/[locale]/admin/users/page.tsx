'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Users, Search, Loader2, Shield, Building2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

export default function AdminUsersPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotal(data.pagination?.total || 0);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const getRoleBadge = (role: string) => {
    const variants: Record<string, string> = {
      SUPER_ADMIN: 'error',
      ADMIN: 'warning',
      COMPANY: 'info',
      USER: 'neutral',
    };
    return <StatusBadge variant={variants[role] || 'neutral'}>{role}</StatusBadge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          {t('sidebar.users')}
        </h1>
        <p className="text-muted-foreground mt-1">Manage platform users ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="COMPANY">Company</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">Name</th>
                    <th className="text-start p-3 font-medium">Email</th>
                    <th className="text-start p-3 font-medium">Role</th>
                    <th className="text-start p-3 font-medium">Status</th>
                    <th className="text-start p-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{user.name || '—'}</td>
                      <td className="p-3 text-muted-foreground">{user.email}</td>
                      <td className="p-3">{getRoleBadge(user.role)}</td>
                      <td className="p-3">
                        {user.isVerified ? (
                          <StatusBadge variant="verified">Verified</StatusBadge>
                        ) : (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
