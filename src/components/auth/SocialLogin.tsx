"use client";

import { useTranslations, useLocale } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaTelegram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
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

    const botName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "SecureMarketplace_login_Bot";
    const botId = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID || "8630387079";

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

    const handleTelegramLogin = () => {
        setTelegramError(null);
        setIsTelegramLoading(true);
        const origin = window.location.origin;
        
        console.log(`[Telegram Auth] Initiating login...`);
        console.log(`[Telegram Auth] Bot ID: ${botId}`);
        console.log(`[Telegram Auth] Origin: ${origin}`);
        console.log(`[Telegram Auth] Locale: ${locale}`);
        
        const telegramUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}&embed=1&request_access=write&lang=${locale}`;
        
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
                    setIsTelegramLoading(false);
                    console.log(`[Telegram Auth] Popup closed by user or system.`);
                    // We don't know if it was successful yet, but if it closed without redirecting, it failed
                    return;
                }
                
                try {
                    const params = new URLSearchParams(popup.location.search);
                    const hash = params.get('hash');
                    if (hash) {
                        console.log(`[Telegram Auth] Success! Received hash.`);
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
                        setIsTelegramLoading(false);
                    }
                } catch (e) {
                    // Cross-origin errors are expected until redirect back to origin
                }
            }, 500);
        } else {
            setIsTelegramLoading(false);
            setTelegramError("Could not open Telegram login window. Please disable your popup blocker.");
        }
    };

    // Callback for Telegram (for the widget fallback if it works)
    useEffect(() => {
        (window as any).onTelegramAuth = (user: any) => {
            if (user) {
                console.log(`[Telegram Auth] Widget Callback Success!`);
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

            {telegramError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-3 text-sm text-destructive animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{telegramError}</p>
                </div>
            )}

            {isTelegramLoading && (
                <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-lg p-4 flex items-start gap-3 text-sm text-sky-700 dark:text-sky-300 animate-pulse">
                    <Info className="w-5 h-5 flex-shrink-0" />
                    <div className="space-y-1">
                        <p className="font-semibold">Check your Telegram app!</p>
                        <p>Telegram has sent you a message to confirm your login. Please click "Confirm" in your app to continue.</p>
                    </div>
                </div>
            )}
            
            {/* Social Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <Button
                    variant="outline"
                    onClick={() => handleLogin('google')}
                    className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors py-6 sm:py-2"
                    type="button"
                    disabled={isTelegramLoading}
                >
                    <FcGoogle className="w-5 h-5 sm:me-2" />
                    <span className="sm:inline">{t("google")}</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleLogin('facebook')}
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors py-6 sm:py-2"
                    type="button"
                    disabled={isTelegramLoading}
                >
                    <FaFacebook className="w-5 h-5 text-blue-600 sm:me-2" />
                    <span className="sm:inline">{t("facebook")}</span>
                </Button>
                <Button
                    variant="outline"
                    onClick={handleTelegramLogin}
                    className={`w-full hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors py-6 sm:py-2 ${isTelegramLoading ? 'border-sky-500 ring-2 ring-sky-500/20' : ''}`}
                    type="button"
                    disabled={isTelegramLoading}
                >
                    {isTelegramLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-sky-500 sm:me-2" />
                    ) : (
                        <FaTelegram className="w-5 h-5 text-sky-500 sm:me-2" />
                    )}
                    <span className="sm:inline">{isTelegramLoading ? "Waiting..." : t("telegram")}</span>
                </Button>
            </div>
        </div>
    );
}
