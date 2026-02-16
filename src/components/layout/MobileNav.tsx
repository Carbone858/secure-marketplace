'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
    Home,
    Search,
    Plus,
    User,
    Menu,
    Building2,
    LogOut,
    Bell,
    MessageSquare,
    Briefcase,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useRouter } from 'next/navigation';

export function MobileNav() {
    const t = useTranslations();
    const locale = useLocale();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { setMode, setBrandTheme, resolvedTheme: mode, brandTheme } = useTheme();

    const switchLocale = (newLocale: string) => {
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
        setOpen(false);
    };


    const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    const mainLinks = [
        {
            name: t('nav.links.home'),
            href: `/${locale}`,
            icon: Home,
        },
        {
            name: t('nav.links.requests'),
            href: `/${locale}/requests`,
            icon: Search,
        },
        {
            name: 'Start',
            href: `/${locale}/requests/start`,
            icon: Plus,
            special: true,
        },
        {
            name: t('nav.links.companies'),
            href: `/${locale}/companies`,
            icon: Building2,
        },
    ];

    const navigation = [
        { name: t('nav.links.home'), href: `/${locale}` },
        { name: t('nav.links.companies'), href: `/${locale}/companies` },
        { name: t('nav.links.requests'), href: `/${locale}/requests` },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {mainLinks.map((item) => {
                    const active = isActive(item.href);
                    if (item.special) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center justify-center -mt-6"
                            >
                                <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform active:scale-95">
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <span className="text-[10px] font-medium mt-1 text-primary">{t('nav.auth.getStarted')}</span>
                            </Link>
                        );
                    }
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <item.icon className={`h-6 w-6 ${active ? 'fill-current' : ''}`} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Menu Trigger */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <button
                            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${open ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Menu className="h-6 w-6" />
                            <span className="text-[10px] font-medium">{locale === 'ar' ? 'القائمة' : 'Menu'}</span>
                        </button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl px-0">
                        <SheetHeader className="px-6 mb-4 text-start">
                            <div className="flex items-center gap-3">
                                {user ? (
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.image || undefined} />
                                        <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-lg">{user ? user.name : (locale === 'ar' ? 'زائر' : 'Guest')}</p>
                                    <p className="text-sm text-muted-foreground">{user ? user.email : (locale === 'ar' ? 'أهلاً بك!' : 'Welcome!')}</p>
                                </div>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="absolute end-4 top-4 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>
                        </SheetHeader>

                        <div className="px-4 overflow-y-auto max-h-[calc(85vh-100px)] pb-10">
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {user ? (
                                    <>
                                        <Link
                                            href={`/${locale}/dashboard`}
                                            onClick={() => setOpen(false)}
                                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors gap-2"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-sm">{t('nav.userMenu.dashboard')}</span>
                                        </Link>
                                        <Link
                                            href={`/${locale}/dashboard/messages`}
                                            onClick={() => setOpen(false)}
                                            className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors gap-2"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <MessageSquare className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium text-sm">{locale === 'ar' ? 'الرسائل' : 'Messages'}</span>
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={`/${locale}/auth/login`}
                                        onClick={() => setOpen(false)}
                                        className="flex flex-col items-center justify-center p-4 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors gap-2 col-span-2"
                                    >
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <span className="font-medium text-sm">{t('nav.auth.signIn')}</span>
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-1">
                                <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{locale === 'ar' ? 'التنقل' : 'Navigation'}</p>
                                {navigation.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted font-medium"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t space-y-6">
                                {/* Theme Selection */}
                                <div className="space-y-3 px-2">
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{locale === 'ar' ? 'المظهر' : 'Appearance'}</span>
                                    <div className="grid grid-cols-3 gap-2">
                                        <Button
                                            variant={mode === 'light' && !brandTheme ? 'default' : 'outline'}
                                            onClick={() => { setMode('light'); setBrandTheme(null); setOpen(false); }}
                                            className="h-9 text-xs"
                                        >
                                            {locale === 'ar' ? 'فاتح' : 'Light'}
                                        </Button>
                                        <Button
                                            variant={mode === 'dark' ? 'default' : 'outline'}
                                            onClick={() => { setMode('dark'); setBrandTheme(null); setOpen(false); }}
                                            className="h-9 text-xs"
                                        >
                                            {locale === 'ar' ? 'داكن' : 'Dark'}
                                        </Button>
                                        <Button
                                            variant={brandTheme?.name === 'emerald' ? 'default' : 'outline'}
                                            onClick={() => { setMode('light'); setBrandTheme('emerald'); setOpen(false); }}
                                            className="h-9 text-xs"
                                        >
                                            {locale === 'ar' ? 'زمردي' : 'Emerald'}
                                        </Button>
                                    </div>
                                </div>

                                {/* Language Selection */}
                                <div className="space-y-3 px-2">
                                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{locale === 'ar' ? 'اللغة' : 'Language'}</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={locale === 'en' ? 'default' : 'outline'}
                                            onClick={() => switchLocale('en')}
                                            className="h-9 text-xs"
                                        >
                                            English
                                        </Button>
                                        <Button
                                            variant={locale === 'ar' ? 'default' : 'outline'}
                                            onClick={() => switchLocale('ar')}
                                            className="h-9 text-xs font-arabic"
                                        >
                                            العربية
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {user && (
                                <div className="mt-6 pt-6 border-t">
                                    <button
                                        onClick={() => {
                                            logout();
                                            setOpen(false);
                                        }}
                                        className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-destructive hover:bg-destructive/10 font-medium"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        {t('nav.userMenu.logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
