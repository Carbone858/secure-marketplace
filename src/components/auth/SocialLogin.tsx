"use client";

import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useEffect } from "react";

declare global {
    interface Window {
        onTelegramAuth: (user: any) => void;
    }
}

export function SocialLogin() {
    const t = useTranslations("auth.social");
    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME;

    useEffect(() => {
        if (!botName) return;

        // Define the callback for Telegram Auth
        window.onTelegramAuth = (user: any) => {
            if (user) {
                signIn('telegram', {
                    ...user,
                    callbackUrl: "/dashboard"
                });
            }
        };

        // Load Telegram script and append to container
        const container = document.getElementById('telegram-widget-container');
        if (container && !container.hasChildNodes()) {
            const script = document.createElement('script');
            script.src = "https://telegram.org/js/telegram-widget.js?22";
            script.async = true;
            script.setAttribute('data-telegram-login', botName);
            script.setAttribute('data-size', 'large');
            script.setAttribute('data-onauth', 'onTelegramAuth(user)');
            script.setAttribute('data-request-access', 'write');
            container.appendChild(script);
        }
    }, [botName]);

    const handleLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/dashboard" });
    };

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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                
                {/* Telegram Login Button Wrapper */}
                <div className="flex justify-center items-center border rounded-md hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors cursor-pointer relative py-6 sm:py-2 h-full min-h-[44px]">
                    <div className="flex items-center justify-center w-full h-full absolute inset-0 z-0 pointer-events-none">
                        <FaTelegram className="w-5 h-5 text-sky-500 sm:me-2" />
                        <span className="text-sm font-medium sm:inline">{t("telegram")}</span>
                    </div>
                    {/* The actual Telegram widget overlayed and invisible to capture clicks */}
                    <div 
                        id="telegram-widget-container"
                        className="opacity-0 absolute inset-0 z-10 overflow-hidden flex justify-center items-center [&>iframe]:!w-full [&>iframe]:!h-full [&>iframe]:!min-w-full [&>iframe]:!cursor-pointer"
                    >
                        {/* Script injected via useEffect */}
                    </div>
                </div>
            </div>
        </div>
    );
}
