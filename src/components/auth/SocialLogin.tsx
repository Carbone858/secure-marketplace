"use client";

import { useTranslations } from "next-intl";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function SocialLogin() {
    const t = useTranslations("auth.social");

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
            <div className="grid grid-cols-2 gap-4">
                <Button
                    variant="outline"
                    onClick={() => handleLogin('google')}
                    className="w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    type="button"
                >
                    <FcGoogle className="w-5 h-5 me-2" />
                    {t("google")}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleLogin('facebook')}
                    className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    type="button"
                >
                    <FaFacebook className="w-5 h-5 text-blue-600 me-2" />
                    {t("facebook")}
                </Button>
            </div>
        </div>
    );
}
