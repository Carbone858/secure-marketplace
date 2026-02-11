'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Menu,
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
import { useAuth } from '@/components/providers/AuthProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: `/${locale}` },
    { name: 'Companies', href: `/${locale}/companies` },
    { name: 'Requests', href: `/${locale}/requests` },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">ServiceMarket</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />

            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/${locale}/dashboard/notifications`}>
                    <Bell className="h-5 w-5" />
                  </Link>
                </Button>

                {/* Messages */}
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/${locale}/dashboard/messages`}>
                    <MessageSquare className="h-5 w-5" />
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || undefined} />
                        <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      <span className="max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={`/${locale}/dashboard`}>
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>

                    {user.role === 'COMPANY' && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/company/dashboard`}>
                          <Building2 className="h-4 w-4 mr-2" />
                          Company Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                      <DropdownMenuItem asChild>
                        <Link href={`/${locale}/admin`}>
                          <Briefcase className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href={`/${locale}/auth/login`}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href={`/${locale}/auth/register`}>Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-sm font-medium ${
                    isActive(item.href)
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="pt-4 border-t">
                <LanguageSwitcher />
              </div>

              {user ? (
                <div className="space-y-2 pt-4 border-t">
                  <Link
                    href={`/${locale}/dashboard`}
                    className="block py-2 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-sm text-destructive"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t">
                  <Button variant="outline" asChild>
                    <Link href={`/${locale}/auth/login`}>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/${locale}/auth/register`}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
