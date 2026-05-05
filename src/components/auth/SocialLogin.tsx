"use client";

import { useTranslations, useLocale } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTelegram } from "react-icons/fa";
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
    const locale = useLocale();
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "SecureMarketplace_login_Bot";
    // Extract Bot ID from token if available, otherwise use hardcoded one from the token provided
    // 8630387079:AAGN4koTvyHUQOckDjpoGtvyz7aD6hDBeqE -> 8630387079
    const botId = "8630387079"; 

    const handleLogin = (provider: string) => {
        // For Google we use 'hl', for Facebook we use 'locale'
        const authParams: any = {};
        if (provider === 'google') {
            authParams.hl = locale;
        } else if (provider === 'facebook') {
            authParams.locale = locale === 'ar' ? 'ar_AR' : 'en_US';
        }

        signIn(provider, { callbackUrl: "/dashboard" }, authParams);
    };

    const handleTelegramLogin = () => {
        const origin = window.location.origin;
        // Adding hl parameter for Telegram language support
        const telegramUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}&embed=1&request_access=write&hl=${locale}`;
        
        const width = 550;
        const height = 470;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
            telegramUrl,
            'telegram_login',
            `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`
        );
        
        if (popup) {
            const checkPopup = setInterval(() => {
                if (popup.closed) {
                    clearInterval(checkPopup);
                    return;
                }
                
                try {
                    const params = new URLSearchParams(popup.location.search);
                    const hash = params.get('hash');
                    if (hash) {
                        const userData: any = {};
                        params.forEach((value, key) => {
                            userData[key] = value;
                        });
                        
                        signIn('telegram', {
                            ...userData,
                            callbackUrl: "/dashboard"
                        });
                        popup.close();
                        clearInterval(checkPopup);
                    }
                } catch (e) {
                    // Cross-origin errors are expected until redirect back to origin
                }
            }, 500);
        }
    };

    // Callback for Telegram (for the widget fallback if it works)
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
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
                <Button
                    variant="outline"
                    onClick={handleTelegramLogin}
                    className="w-full hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors py-6 sm:py-2"
                    type="button"
                >
                    <FaTelegram className="w-5 h-5 text-sky-500 sm:me-2" />
                    <span className="sm:inline">{t("telegram")}</span>
                </Button>
            </div>
        </div>
    );
}
