export const dynamic = 'force-dynamic';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/next-auth-options';

import { NextRequest } from 'next/server';

const handler = (req: NextRequest, ctx: any) => {
    const referer = req.headers.get('referer') || '';
    const isArabic = referer.includes('/ar/') || referer.endsWith('/ar') || req.nextUrl.searchParams.get('locale') === 'ar_AR';
    
    if (isArabic) {
        const customAuthOptions = {
            ...authOptions,
            providers: authOptions.providers.map((p: any) => {
                if (p.id === 'facebook') {
                    return {
                        ...p,
                        authorization: {
                            ...(p.authorization || {}),
                            url: "https://ar-ar.facebook.com/v15.0/dialog/oauth"
                        }
                    };
                }
                return p;
            })
        };
        return NextAuth(customAuthOptions)(req, ctx);
    }
    
    return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };
