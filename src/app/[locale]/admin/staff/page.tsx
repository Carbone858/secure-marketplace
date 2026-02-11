'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Users, Shield, Building, Loader2, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';

type Tab = 'staff' | 'roles' | 'departments';

export default function AdminStaffPage() {
  const locale = useLocale();
  const t = useTranslations('admin');
  const [activeTab, setActiveTab] = useState<Tab>('staff');
  const [staff, setStaff] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Forms
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: '', nameAr: '', description: '' });
  const [showDeptForm, setShowDeptForm] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', nameAr: '', description: '' });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState({ userId: '', roleId: '', departmentId: '' });

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
      toast.error('Failed to load staff data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const createRole = async () => {
    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleForm),
      });
      if (!res.ok) throw new Error();
      toast.success('Role created');
      setShowRoleForm(false);
      setRoleForm({ name: '', nameAr: '', description: '' });
      fetchAll();
    } catch { toast.error('Failed to create role'); }
  };

  const createDept = async () => {
    try {
      const res = await fetch('/api/admin/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptForm),
      });
      if (!res.ok) throw new Error();
      toast.success('Department created');
      setShowDeptForm(false);
      setDeptForm({ name: '', nameAr: '', description: '' });
      fetchAll();
    } catch { toast.error('Failed to create department'); }
  };

  const assignStaff = async () => {
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed');
      }
      toast.success('Staff member assigned');
      setShowStaffForm(false);
      setStaffForm({ userId: '', roleId: '', departmentId: '' });
      fetchAll();
    } catch (err: any) { toast.error(err.message || 'Failed to assign staff'); }
  };

  const deleteRole = async (id: string) => {
    if (!confirm('Delete this role?')) return;
    try {
      const res = await fetch(`/api/admin/roles?id=${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('Role deleted');
      fetchAll();
    } catch (err: any) { toast.error(err.message || 'Failed'); }
  };

  const deleteDept = async (id: string) => {
    if (!confirm('Delete this department?')) return;
    try {
      const res = await fetch(`/api/admin/departments?id=${id}`, { method: 'DELETE' });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      toast.success('Department deleted');
      fetchAll();
    } catch (err: any) { toast.error(err.message || 'Failed'); }
  };

  const removeStaff = async (id: string) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      const res = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Staff member removed');
      fetchAll();
    } catch { toast.error('Failed'); }
  };

  const tabs = [
    { key: 'staff' as Tab, label: 'Staff Members', icon: Users },
    { key: 'roles' as Tab, label: 'Roles', icon: Shield },
    { key: 'departments' as Tab, label: 'Departments', icon: Building },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Staff Management
        </h1>
        <p className="text-muted-foreground mt-1">Manage roles, departments, and staff assignments</p>
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
            <Badge variant="secondary" className="ml-1">
              {key === 'staff' ? staff.length : key === 'roles' ? roles.length : departments.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Staff Members Tab */}
      {activeTab === 'staff' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowStaffForm(!showStaffForm)}>
              <Plus className="h-4 w-4 mr-2" /> Assign Staff
            </Button>
          </div>
          {showStaffForm && (
            <Card>
              <CardHeader><CardTitle>Assign Staff Member</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="User ID" value={staffForm.userId} onChange={(e) => setStaffForm({ ...staffForm, userId: e.target.value })} />
                  <select value={staffForm.roleId} onChange={(e) => setStaffForm({ ...staffForm, roleId: e.target.value })} className="border rounded-md px-3 py-2 text-sm bg-background">
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <select value={staffForm.departmentId} onChange={(e) => setStaffForm({ ...staffForm, departmentId: e.target.value })} className="border rounded-md px-3 py-2 text-sm bg-background">
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={assignStaff}>Assign</Button>
                  <Button variant="outline" onClick={() => setShowStaffForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-0">
              {staff.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">No staff members assigned</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-start p-3 font-medium">Name</th>
                      <th className="text-start p-3 font-medium">Email</th>
                      <th className="text-start p-3 font-medium">Role</th>
                      <th className="text-start p-3 font-medium">Department</th>
                      <th className="text-start p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-muted/30">
                        <td className="p-3 font-medium">{s.user?.name || '—'}</td>
                        <td className="p-3 text-muted-foreground">{s.user?.email}</td>
                        <td className="p-3"><Badge>{s.role?.name}</Badge></td>
                        <td className="p-3 text-muted-foreground">{s.department?.name || '—'}</td>
                        <td className="p-3">
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

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowRoleForm(!showRoleForm)}>
              <Plus className="h-4 w-4 mr-2" /> Add Role
            </Button>
          </div>
          {showRoleForm && (
            <Card>
              <CardHeader><CardTitle>Create Role</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Name" value={roleForm.name} onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })} />
                  <Input placeholder="Name (Arabic)" value={roleForm.nameAr} onChange={(e) => setRoleForm({ ...roleForm, nameAr: e.target.value })} />
                  <Input placeholder="Description" value={roleForm.description} onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createRole}>Create</Button>
                  <Button variant="outline" onClick={() => setShowRoleForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{role.name} {role.nameAr && `(${role.nameAr})`}</h3>
                    {role.description && <p className="text-sm text-muted-foreground">{role.description}</p>}
                    <Badge variant="secondary" className="mt-1">{role._count?.members || 0} members</Badge>
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

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <>
          <div className="flex justify-end">
            <Button onClick={() => setShowDeptForm(!showDeptForm)}>
              <Plus className="h-4 w-4 mr-2" /> Add Department
            </Button>
          </div>
          {showDeptForm && (
            <Card>
              <CardHeader><CardTitle>Create Department</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Name" value={deptForm.name} onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })} />
                  <Input placeholder="Name (Arabic)" value={deptForm.nameAr} onChange={(e) => setDeptForm({ ...deptForm, nameAr: e.target.value })} />
                  <Input placeholder="Description" value={deptForm.description} onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button onClick={createDept}>Create</Button>
                  <Button variant="outline" onClick={() => setShowDeptForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4">
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{dept.name} {dept.nameAr && `(${dept.nameAr})`}</h3>
                    {dept.description && <p className="text-sm text-muted-foreground">{dept.description}</p>}
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary">{dept._count?.members || 0} members</Badge>
                      <Badge variant="outline">{dept._count?.messages || 0} messages</Badge>
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
