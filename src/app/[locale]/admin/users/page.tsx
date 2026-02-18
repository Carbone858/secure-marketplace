'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Users, Search, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/composite';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const ROLES = ['USER', 'COMPANY', 'ADMIN', 'SUPER_ADMIN'] as const;

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
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const updateUser = async (id: string, data: { role?: string; isActive?: boolean }) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed');
      }
      toast.success('User updated successfully');
      // Optimistic update
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    } catch (err: any) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setUpdatingId(null);
    }
  };

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
        <p className="text-muted-foreground mt-1">{t('users.subtitle')} ({total} total)</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('users.searchPlaceholder')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="border rounded-md px-3 py-2 text-sm bg-background"
            >
              <option value="">{t('users.allRoles')}</option>
              <option value="USER">{t('users.roleUser')}</option>
              <option value="COMPANY">{t('users.roleCompany')}</option>
              <option value="ADMIN">{t('users.roleAdmin')}</option>
              <option value="SUPER_ADMIN">{t('users.roleSuperAdmin')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><PageSkeleton /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">{t('users.noUsers')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-start p-3 font-medium">{t('users.tableHeaders.name')}</th>
                    <th className="text-start p-3 font-medium">{t('users.tableHeaders.email')}</th>
                    <th className="text-start p-3 font-medium">{t('users.tableHeaders.role')}</th>
                    <th className="text-start p-3 font-medium">{t('users.tableHeaders.status')}</th>
                    <th className="text-start p-3 font-medium">{t('users.tableHeaders.joined')}</th>
                    <th className="text-start p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{user.name || '—'}</td>
                      <td className="p-3 text-muted-foreground">{user.email}</td>
                      <td className="p-3">{getRoleBadge(user.role)}</td>
                      <td className="p-3">
                        {user.isActive !== false ? (
                          <StatusBadge variant="verified">Active</StatusBadge>
                        ) : (
                          <Badge variant="destructive">Banned</Badge>
                        )}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" disabled={updatingId === user.id} className="gap-1">
                              Actions <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Change Role</div>
                            {ROLES.map(role => (
                              <DropdownMenuItem
                                key={role}
                                onClick={() => updateUser(user.id, { role })}
                                className={user.role === role ? 'bg-muted font-medium' : ''}
                              >
                                {role}
                                {user.role === role && <span className="ms-auto text-xs">✓</span>}
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            {user.isActive !== false ? (
                              <DropdownMenuItem
                                onClick={() => updateUser(user.id, { isActive: false })}
                                className="text-destructive focus:text-destructive"
                              >
                                Ban User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => updateUser(user.id, { isActive: true })}>
                                Unban User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
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
            {t('common.page', { page, total: totalPages })}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>
              {t('common.previous')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}>
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
