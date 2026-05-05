"use client";

import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import Script from "next/script";

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void;
    }
}

export function SocialLogin() {
    const t = useTranslations("auth.social");
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "SecureMarketplace_login_Bot"; // Hardcoded fallback for testing

    useEffect(() => {
        console.log('DEBUG: Telegram Bot Name:', botName);
    }, [botName]);

    const handleLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/dashboard" });
    };

    // Callback for Telegram
    useEffect(() => {
        (window as any).onTelegramAuth = (user: any) => {
            if (user) {
                signIn('telegram', {
                    ...user,
                    callbackUrl: "/dashboard"
                });
            }
        };
    }, []);

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

            {/* Telegram - Dedicated Row for Reliability */}
            {botName ? (
                <div className="flex flex-col items-center justify-center pt-2">
                    <div id="telegram-widget-wrapper" className="min-h-[44px] flex items-center justify-center">
                        <Script
                            src="https://telegram.org/js/telegram-widget.js?22"
                            strategy="afterInteractive"
                            data-telegram-login={botName}
                            data-size="large"
                            data-onauth="onTelegramAuth(user)"
                            data-request-access="write"
                            data-userpic="false"
                        />
                    </div>
                </div>
            ) : (
                <div className="text-center text-xs text-muted-foreground">
                    Telegram Login Unavailable (Bot name missing)
                </div>
            )}
        </div>
    );
}
