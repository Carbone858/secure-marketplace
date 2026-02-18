'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { Users, Shield, Building, Plus, Trash2, Edit2, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { PageSkeleton } from '@/components/ui/skeleton';

type Tab = 'staff' | 'roles' | 'departments';

interface UserOption { id: string; name: string | null; email: string; }

export default function AdminStaffPage() {
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState<Tab>('staff');
  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // User search state
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState<UserOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Forms
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: '', nameAr: '', description: '' });
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', nameAr: '', description: '' });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState({ roleId: '', departmentId: '' });

  // Edit staff
  const [editingStaff, setEditingStaff] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ roleId: '', departmentId: '' });

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [staffRes, rolesRes, deptsRes] = await Promise.all([
        fetch('/api/admin/staff'),
        fetch('/api/admin/roles'),
        fetch('/api/admin/departments'),
      ]);
      if (staffRes.ok) { const d = await staffRes.json(); setStaff(d.staff || []); }
      if (rolesRes.ok) { const d = await rolesRes.json(); setRoles(d.roles || []); }
      if (deptsRes.ok) { const d = await deptsRes.json(); setDepartments(d.departments || []); }
    } catch {
      toast.error(t('staff_mgmt.toasts.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // User search with debounce
  useEffect(() => {
    if (!userSearch || userSearch.length < 2) { setUserResults([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}&limit=8`);
        if (res.ok) {
          const data = await res.json();
          setUserResults(data.users || []);
        }
      } catch { /* ignore */ } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [userSearch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setUserResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const createRole = async () => {
    if (!roleForm.name) { toast.error('Role name is required'); return; }
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });
      if (!res.ok) throw new Error();
      toast.success(t('staff_mgmt.toasts.roleCreated'));
      setShowRoleForm(false);
      setRoleForm({ name: '', nameAr: '', description: '' });
      fetchAll();
    } catch { toast.error(t('staff_mgmt.toasts.roleCreateFailed')); }
  };

  const createDept = async () => {
    if (!deptForm.name) { toast.error('Department name is required'); return; }
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptForm),
      });
      if (!res.ok) throw new Error();
      toast.success(t('staff_mgmt.toasts.deptCreated'));
      setShowDeptForm(false);
      setDeptForm({ name: '', nameAr: '', description: '' });
      fetchAll();
    } catch { toast.error(t('staff_mgmt.toasts.deptCreateFailed')); }
  };

  const assignStaff = async () => {
    if (!selectedUser) { toast.error('Please select a user'); return; }
    if (!staffForm.roleId) { toast.error('Please select a role'); return; }
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id, ...staffForm }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      toast.success(t('staff_mgmt.toasts.staffAssigned'));
      setShowStaffForm(false);
      setSelectedUser(null);
      setUserSearch('');
      setStaffForm({ roleId: '', departmentId: '' });
      fetchAll();
    } catch (err: any) { toast.error(err.message || t('staff_mgmt.toasts.staffAssignFailed')); }
  };

  const updateStaff = async () => {
    if (!editingStaff) return;
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingStaff.id, ...editForm }),
      });
      if (!res.ok) throw new Error();
      toast.success('Staff member updated');
      setEditingStaff(null);
      fetchAll();
    } catch { toast.error('Failed to update staff member'); }
  };

  const deleteRole = async (id: string) => {
    if (!confirm(t('staff_mgmt.confirmDeleteRole'))) return;
    try {
      const res = await fetch(`/api/admin/roles?id=${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success(t('staff_mgmt.toasts.roleDeleted'));
      fetchAll();
    } catch (err: any) { toast.error(err.message || t('staff_mgmt.toasts.failed')); }
  };

  const deleteDept = async (id: string) => {
    if (!confirm(t('staff_mgmt.confirmDeleteDept'))) return;
    try {
      const res = await fetch(`/api/admin/departments?id=${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success(t('staff_mgmt.toasts.deptDeleted'));
      fetchAll();
    } catch (err: any) { toast.error(err.message || t('staff_mgmt.toasts.failed')); }
  };

  const removeStaff = async (id: string) => {
    if (!confirm(t('staff_mgmt.confirmRemoveStaff'))) return;
    try {
      const res = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success(t('staff_mgmt.toasts.staffRemoved'));
      fetchAll();
    } catch { toast.error(t('staff_mgmt.toasts.failed')); }
  };

  const tabs = [
    { key: 'staff' as Tab, label: t('staff_mgmt.tabs.staffMembers'), icon: Users },
    { key: 'roles' as Tab, label: t('staff_mgmt.tabs.roles'), icon: Shield },
    { key: 'departments' as Tab, label: t('staff_mgmt.tabs.departments'), icon: Building },
  ];

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          {t('staff_mgmt.title')}
        </h1>
        <p className="text-muted-foreground mt-1">{t('staff_mgmt.subtitle')}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {tabs.map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? 'default' : 'ghost'}
            onClick={() => setActiveTab(key)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
            <Badge variant="secondary" className="ms-1">
              {key === 'staff' ? staff.length : key === 'roles' ? roles.length : departments.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* ── Staff Members Tab ── */}
      {activeTab === 'staff' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => { setShowStaffForm(!showStaffForm); setSelectedUser(null); setUserSearch(''); }}>
              <Plus className="h-4 w-4 me-2" /> {t('staff_mgmt.assignStaff')}
            </Button>
          </div>

          {showStaffForm && (
            <Card>
              <CardHeader><CardTitle>{t('staff_mgmt.assignStaffMember')}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* Warning if no roles exist */}
                {roles.length === 0 && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
                    <span className="text-lg">⚠️</span>
                    <div className="flex-1 text-sm">
                      <p className="font-medium">No roles available</p>
                      <p className="text-amber-700 dark:text-amber-300 mt-0.5">You need to create at least one role before assigning staff.</p>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 border-amber-400 text-amber-800 dark:text-amber-200" onClick={() => { setShowStaffForm(false); setActiveTab('roles'); setShowRoleForm(true); }}>
                      Create Role
                    </Button>
                  </div>
                )}
                {/* User search */}
                <div>
                  <label className="text-sm font-medium mb-1 block">Search User</label>
                  <div className="relative" ref={searchRef}>
                    <div className="relative">
                      <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      {selectedUser ? (
                        <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-muted/50">
                          <span className="flex-1 text-sm">
                            <span className="font-medium">{selectedUser.name || 'No name'}</span>
                            <span className="text-muted-foreground ms-2">{selectedUser.email}</span>
                          </span>
                          <button onClick={() => { setSelectedUser(null); setUserSearch(''); }} className="text-muted-foreground hover:text-foreground">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <Input
                          placeholder="Search by name or email..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                          className="ps-9"
                        />
                      )}
                    </div>
                    {/* Dropdown results */}
                    {!selectedUser && userResults.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {userResults.map((u) => (
                          <button
                            key={u.id}
                            className="w-full text-start px-3 py-2 hover:bg-muted text-sm flex flex-col"
                            onClick={() => { setSelectedUser(u); setUserSearch(''); setUserResults([]); }}
                          >
                            <span className="font-medium">{u.name || 'No name'}</span>
                            <span className="text-muted-foreground text-xs">{u.email}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {!selectedUser && searchLoading && (
                      <div className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg px-3 py-2 text-sm text-muted-foreground">
                        Searching...
                      </div>
                    )}
                    {!selectedUser && userSearch.length >= 2 && !searchLoading && userResults.length === 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-card border rounded-md shadow-lg px-3 py-2 text-sm text-muted-foreground">
                        No users found
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('staff_mgmt.selectRole')} *</label>
                    <select value={staffForm.roleId} onChange={(e) => setStaffForm({ ...staffForm, roleId: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                      <option value="">{t('staff_mgmt.selectRole')}</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('staff_mgmt.selectDepartment')}</label>
                    <select value={staffForm.departmentId} onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                      <option value="">{t('staff_mgmt.selectDepartment')}</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={assignStaff} disabled={!selectedUser || !staffForm.roleId}>{t('staff_mgmt.assign')}</Button>
                  <Button variant="outline" onClick={() => { setShowStaffForm(false); setSelectedUser(null); setUserSearch(''); }}>{t('common.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Staff Modal */}
          {editingStaff && (
            <Card className="border-primary/50">
              <CardHeader><CardTitle>Edit Staff Member: {editingStaff.user?.name}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Role</label>
                    <select value={editForm.roleId} onChange={(e) => setEditForm({ ...editForm, roleId: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                      <option value="">Select role</option>
                      {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Department</label>
                    <select value={editForm.departmentId} onChange={(e) => setEditForm({ ...editForm, departmentId: e.target.value })} className="w-full border rounded-md px-3 py-2 text-sm bg-background">
                      <option value="">No department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={updateStaff}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setEditingStaff(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              {staff.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">{t('staff_mgmt.noStaff')}</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-3 font-medium">{t('staff_mgmt.tableHeaders.name')}</th>
                      <th className="text-start p-3 font-medium">{t('staff_mgmt.tableHeaders.email')}</th>
                      <th className="text-start p-3 font-medium">{t('staff_mgmt.tableHeaders.role')}</th>
                      <th className="text-start p-3 font-medium">{t('staff_mgmt.tableHeaders.department')}</th>
                      <th className="text-start p-3 font-medium">{t('staff_mgmt.tableHeaders.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">{s.user?.name || '—'}</td>
                        <td className="p-3 text-muted-foreground">{s.user?.email}</td>
                        <td className="p-3"><Badge>{s.role?.name}</Badge></td>
                        <td className="p-3 text-muted-foreground">{s.department?.name || '—'}</td>
                        <td className="p-3 flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingStaff(s); setEditForm({ roleId: s.role?.id || '', departmentId: s.department?.id || '' }); }}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeStaff(s.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ── Roles Tab ── */}
      {activeTab === 'roles' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowRoleForm(!showRoleForm)}>
              <Plus className="h-4 w-4 me-2" /> {t('staff_mgmt.addRole')}
            </Button>
          </div>
          {showRoleForm && (
            <Card>
              <CardHeader><CardTitle>{t('staff_mgmt.createRole')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder={t('staff_mgmt.namePlaceholder')} value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
                  <Input placeholder={t('staff_mgmt.nameArPlaceholder')} value={roleForm.nameAr} onChange={(e) => setRoleForm({ ...roleForm, nameAr: e.target.value })} />
                  <Input placeholder={t('staff_mgmt.descriptionPlaceholder')} value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createRole}>{t('common.create')}</Button>
                  <Button variant="outline" onClick={() => setShowRoleForm(false)}>{t('common.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4">
            {roles.length === 0 && <p className="text-center text-muted-foreground py-8">No roles yet. Create one above.</p>}
            {roles.map((role) => (
              <Card key={role.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{role.name} {role.nameAr && `(${role.nameAr})`}</h3>
                    {role.description && <p className="text-sm text-muted-foreground">{role.description}</p>}
                    <Badge variant="secondary" className="mt-1">{role._count?.staffMembers || 0} {t('staff_mgmt.members')}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteRole(role.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ── Departments Tab ── */}
      {activeTab === 'departments' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowDeptForm(!showDeptForm)}>
              <Plus className="h-4 w-4 me-2" /> {t('staff_mgmt.addDepartment')}
            </Button>
          </div>
          {showDeptForm && (
            <Card>
              <CardHeader><CardTitle>{t('staff_mgmt.createDepartment')}</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder={t('staff_mgmt.namePlaceholder')} value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} />
                  <Input placeholder={t('staff_mgmt.nameArPlaceholder')} value={deptForm.nameAr} onChange={(e) => setDeptForm({ ...deptForm, nameAr: e.target.value })} />
                  <Input placeholder={t('staff_mgmt.descriptionPlaceholder')} value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createDept}>{t('common.create')}</Button>
                  <Button variant="outline" onClick={() => setShowDeptForm(false)}>{t('common.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4">
            {departments.length === 0 && <p className="text-center text-muted-foreground py-8">No departments yet. Create one above.</p>}
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{dept.name} {dept.nameAr && `(${dept.nameAr})`}</h3>
                    {dept.description && <p className="text-sm text-muted-foreground">{dept.description}</p>}
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{dept._count?.staffMembers || 0} {t('staff_mgmt.members')}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteDept(dept.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
