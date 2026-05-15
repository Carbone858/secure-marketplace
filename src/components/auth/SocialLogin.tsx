"use client";

import { useTranslations, useLocale } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Loader2, AlertCircle, Info } from "lucide-react";

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void;
    }
}

export function SocialLogin() {
    const t = useTranslations("auth.social");
    const locale = useLocale();
    const [isTelegramLoading, setIsTelegramLoading] = useState(false);
    const [telegramError, setTelegramError] = useState<string | null>(null);
    const telegramWrapperRef = useRef<HTMLDivElement>(null);

    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "SecureMarketplace_login_Bot";

    const handleLogin = (provider: string) => {
        setTelegramError(null);
        let authParams: any = {};
        
        if (provider === 'google') {
            authParams = { hl: locale };
        } else if (provider === 'facebook') {
            authParams = { locale: locale === 'ar' ? 'ar_AR' : 'en_US' };
        }

        signIn(provider, { callbackUrl: "/dashboard" }, authParams);
    };

    // Initialize Official Telegram Widget
    useEffect(() => {
        // Clear previous widget if any
        if (telegramWrapperRef.current) {
            telegramWrapperRef.current.innerHTML = '';
        }

        // Define the callback globally
        (window as any).onTelegramAuth = (user: any) => {
            if (user) {
                console.log(`[Telegram Auth] Official Widget Success!`);
                signIn('telegram', {
                    ...user,
                    callbackUrl: "/dashboard"
                });
            }
        };

        // Create the script element
        const script = document.createElement('script');
        script.src = "https://telegram.org/js/telegram-widget.js?22";
        script.setAttribute('data-telegram-login', botName);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '8');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        if (telegramWrapperRef.current) {
            telegramWrapperRef.current.appendChild(script);
        }

        return () => {
            // Cleanup
            if (telegramWrapperRef.current) {
                telegramWrapperRef.current.innerHTML = '';
            }
        };
    }, [botName, locale]);

    return (
        <div className="w-full space-y-6 mt-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-2 text-muted-foreground">
                        {t("or")}
                    </span>
                </div>
            </div>

            {telegramError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{telegramError}</p>
                </div>
            )}
            
            {/* Social Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <Button
                    variant="outline"
                    onClick={() => handleLogin('google')}
                    className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-6 sm:py-2"
                    type="button"
                >
                    <FcGoogle className="w-5 h-5 sm:me-2" />
                    <span className="sm:inline">{t("google")}</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleLogin('facebook')}
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors py-6 sm:py-2"
                    type="button"
                >
                    <FaFacebook className="w-5 h-5 text-blue-600 sm:me-2" />
                    <span className="sm:inline">{t("facebook")}</span>
                </Button>
            </div>

            {/* Telegram Official Widget Container */}
            <div className="flex flex-col items-center space-y-3 pt-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                    {t("telegram")}
                </p>
                <div 
                    ref={telegramWrapperRef} 
                    className="flex justify-center min-h-[40px] w-full transform hover:scale-[1.02] transition-transform"
                />
                
                <div className="w-full space-y-2">
                    <div className="bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/30 rounded-lg p-3 flex items-start gap-3 text-xs text-sky-700 dark:text-sky-400">
                        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <p>Click the button above to receive a confirmation message in your Telegram app.</p>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] text-muted-foreground">
                            Still not getting the message? 
                            <a 
                                href={`https://t.me/${botName}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="ml-1 text-sky-600 hover:underline font-bold"
                            >
                                Try messaging the bot directly
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
