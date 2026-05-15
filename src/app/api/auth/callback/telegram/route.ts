import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const params: any = {};
    searchParams.forEach((value, key) => {
        params[key] = value;
    });

    // Check if we have the hash
    if (!params.hash) {
        return NextResponse.redirect(new URL('/en/auth/login?error=TelegramAuthFailed', req.url));
    }

    // Since we can't easily call signIn('telegram', ...) from a GET route (it needs to be on the client),
    // we will redirect to a client-side page that performs the login.
    // We'll use the login page with the telegram data in the URL
    const loginUrl = new URL('/en/auth/login', req.url);
    loginUrl.searchParams.set('telegram_data', JSON.stringify(params));
    
    return NextResponse.redirect(loginUrl);
}
