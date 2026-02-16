'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {

  X,
  User,
  Building2,
  Briefcase,
  MessageSquare,
  Bell,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';

import { useAuth } from '@/components/providers/AuthProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { user, logout } = useAuth();


  const navigation = [
    { name: t('nav.links.home'), href: `/${locale}` },
    { name: t('nav.links.companies'), href: `/${locale}/companies` },
    { name: t('nav.links.requests'), href: `/${locale}/requests` },
  ];

  const isActive = (href: string) => pathname === href;

  const isRTL = locale === 'ar';
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className={`flex h-16 items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Brand/Logo: right for RTL, left for LTR */}
          <Link href={`/${locale}`} className={`flex items-center gap-2 ${isRTL ? 'order-3' : 'order-1'}`}>
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">{t('nav.brand')}</span>
          </Link>

          {/* Desktop Navigation: center for both directions */}
          <div className={`hidden md:flex items-center gap-6 ${isRTL ? 'order-2 justify-center flex-1' : 'order-2 justify-center flex-1'}`}>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side (LTR) / Left Side (RTL): theme, lang, login */}
          <div className={`hidden md:flex items-center gap-4 ${isRTL ? 'order-1' : 'order-3'}`}>
            <ThemeToggle />
            <LanguageSwitcher />

            {user ? (
              <>
                {/* Notifications & Messages */}
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href={`/${locale}/dashboard/notifications`}>
                      <Bell className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="rounded-full">
                    <Link href={`/${locale}/dashboard/messages`}>
                      <MessageSquare className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 rounded-full hover:bg-muted">
                      <Avatar className="h-8 w-8 ring-2 ring-background">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">{user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="max-w-[100px] truncate hidden lg:inline-block font-medium">{user.name}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/dashboard`}>
                        <User className="h-4 w-4 me-2" />
                        {t('nav.userMenu.dashboard')}
                      </Link>
                    </DropdownMenuItem>

                    {user.role === 'COMPANY' && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/company/dashboard`}>
                          <Building2 className="h-4 w-4 me-2" />
                          {t('nav.userMenu.companyDashboard')}
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/admin`}>
                          <Briefcase className="h-4 w-4 me-2" />
                          {t('nav.userMenu.adminPanel')}
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                      <LogOut className="h-4 w-4 me-2" />
                      {t('nav.userMenu.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="font-medium">
                  <Link href={`/${locale}/auth/login`}>{t('nav.auth.signIn')}</Link>
                </Button>
                <Button asChild className="rounded-full px-6 font-semibold shadow-md hover:shadow-lg transition-all">
                  <Link href={`/${locale}/auth/register`}>{t('nav.auth.getStarted')}</Link>
                </Button>
              </div>
            )}
          </div>


        </div>
      </nav>
    </header>
  );
}
