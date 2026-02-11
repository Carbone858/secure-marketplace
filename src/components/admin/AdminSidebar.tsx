'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  LayoutDashboard,
  Users,
  Building2,
  FileText,
  Briefcase,
  CheckCircle,
  Settings,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Companies',
    href: '/admin/companies',
    icon: Building2,
  },
  {
    title: 'Verifications',
    href: '/admin/verifications',
    icon: CheckCircle,
  },
  {
    title: 'Requests',
    href: '/admin/requests',
    icon: FileText,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: Briefcase,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'bg-card border-r h-screen sticky top-0 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <Link href={`/${locale}`} className="font-bold text-xl">
            Admin
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="p-2 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === `/${locale}${item.href}`;
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
