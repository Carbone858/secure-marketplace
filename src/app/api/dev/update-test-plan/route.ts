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
        // Flexible pattern:
        // 1. Matches "- [ ] ID:"
        // 2. Matches "- [ ] **ID**:"
        // 3. Matches "| [ ] | ID |"
        const pattern = new RegExp(`(\\|\\s*\\[)[ xX](\\]\\s*\\|\\s*${taskId}\\s*\\|)|(-\\s*\\[)[ xX](\\]\\s*(?:\\*\\*)?${taskId}(?:[:\\-]|\\*\\*|\\s))`, 'i');

        const updatedContent = content.replace(pattern, (match, tablePrefix, tableSuffix, listPrefix, listSuffix) => {
            if (tablePrefix && tableSuffix) {
                return `${tablePrefix}${newState}${tableSuffix}`;
            }
            if (listPrefix && listSuffix) {
                return `${listPrefix}${newState}${listSuffix}`;
            }
            return match;
        });

        fs.writeFileSync(filePath, updatedContent);

        return NextResponse.json({ success: true, newState });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
