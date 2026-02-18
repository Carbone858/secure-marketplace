'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
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
  Tags,
  Flag,
  Shield,
  Star,
  DollarSign,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    titleKey: 'sidebar.dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    titleKey: 'sidebar.users',
    href: '/admin/users',
    icon: Users,
  },
  {
    titleKey: 'sidebar.companies',
    href: '/admin/companies',
    icon: Building2,
  },
  {
    titleKey: 'sidebar.verifications',
    href: '/admin/verifications',
    icon: CheckCircle,
  },
  {
    titleKey: 'sidebar.requests',
    href: '/admin/requests',
    icon: FileText,
  },
  {
    titleKey: 'sidebar.projects',
    href: '/admin/projects',
    icon: Briefcase,
  },
  {
    titleKey: 'sidebar.offers',
    href: '/admin/offers',
    icon: DollarSign,
  },
  {
    titleKey: 'sidebar.categories',
    href: '/admin/categories',
    icon: Tags,
  },
  {
    titleKey: 'sidebar.reviews',
    href: '/admin/reviews',
    icon: Star,
  },
  {
    titleKey: 'sidebar.staff',
    href: '/admin/staff',
    icon: Shield,
  },
  {
    titleKey: 'sidebar.cms',
    href: '/admin/cms',
    icon: FileText,
  },
  {
    titleKey: 'sidebar.featureFlags',
    href: '/admin/feature-flags',
    icon: Flag,
  },
  {
    titleKey: 'sidebar.messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    titleKey: 'sidebar.settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('admin');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navContent = (isMobile = false) => (
    <nav className="p-2 space-y-1 overflow-y-auto flex-1">
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
              !isMobile && collapsed && 'justify-center'
            )}
            title={!isMobile && collapsed ? t(item.titleKey) : undefined}
            onClick={() => isMobile && setMobileOpen(false)}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {(isMobile || !collapsed) && <span>{t(item.titleKey)}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile hamburger button — rendered in admin layout header area */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 start-3 z-50 md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile overlay sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute top-0 start-0 h-full w-72 bg-card shadow-lg flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <Link href={`/${locale}`} className="font-bold text-xl" onClick={() => setMobileOpen(false)}>
                {t('sidebar.title')}
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {navContent(true)}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col bg-card border-e h-screen sticky top-0 transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          {!collapsed && (
            <Link href={`/${locale}`} className="font-bold text-xl">
              {t('sidebar.title')}
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ms-auto"
          >
            <span className="ltr:block rtl:hidden">
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </span>
            <span className="rtl:block ltr:hidden">
              {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
          </Button>
        </div>
        {navContent(false)}
      </aside>
    </>
  );
}
