export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const start = Date.now();
    return NextResponse.json({
        message: 'Bypass middleware check (if this is fast, the issue is likely in config matcher or middleware)',
        serverTimestamp: new Date().toISOString(),
        latency: `${Date.now() - start}ms`
    });
}

