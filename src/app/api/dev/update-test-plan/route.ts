import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        const { taskId, completed } = await request.json();
        const filePath = path.join(process.cwd(), 'MANUAL_TEST_PLAN.md');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        let content = fs.readFileSync(filePath, 'utf-8');

        const newState = completed ? 'x' : ' ';
        // Flexible pattern: matches "- [ ] ID:", "- [ ] **ID**:", or "- [ ] ID - "
        const pattern = new RegExp(`- \\[([ xX])\\] (\\*\\*)?${taskId}(?:[:\\-]|\\*\\*|\\s)`, 'i');

        const updatedContent = content.replace(pattern, (match, oldState, boldMarker) => {
            // Reconstruct the line while preserving the task ID and description part
            // Match the whole line to be safe
            const lineMatch = match;
            return lineMatch.replace(`[${oldState}]`, `[${newState}]`);
        });

        fs.writeFileSync(filePath, updatedContent);

        return NextResponse.json({ success: true, newState });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
