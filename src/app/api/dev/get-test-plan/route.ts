import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
    }

    try {
        const filePath = path.join(process.cwd(), 'MANUAL_TEST_PLAN.md');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf-8');

        // Simple parser for the specific format
        const lines = content.split('\n');
        const modules: any[] = [];
        let currentModule: any = null;

        let lastTask: any = null;

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // 1. Check for Module Header: ### 🔹 A. Name OR ## A. Name OR ### MODULE A: Name
            const moduleMatch = trimmed.match(/^###?\s*(?:🔹\s*)?([A-Z])\.?\s*(.*)/i) ||
                trimmed.match(/^###?\s+MODULE\s+([A-Z]):?\s*(.*)/i);

            if (moduleMatch && moduleMatch[1].length === 1) {
                if (currentModule) modules.push(currentModule);
                currentModule = {
                    id: `MODULE ${moduleMatch[1].toUpperCase()}`,
                    name: moduleMatch[2].replace(/\(Total:.*?\)/i, '').replace(/^[^\w\s\(\)]+/, '').trim(),
                    tasks: []
                };
                lastTask = null;
                continue;
            }

            if (!currentModule) continue;

            // 3. Check for Table rows: | Status | ID | Test Case | Steps | Expected Result | Priority |
            const isTableRow = trimmed.startsWith('|') && !trimmed.includes('---');

            if (isTableRow && currentModule && trimmed.split('|').length > 4) {
                const columns = trimmed.split('|').map(c => c.trim()).filter(c => c.length > 0);

                // Expecting at least: Status, ID, Test Case
                if (columns.length >= 3 && columns[1].match(/^[A-Z]-\d+/i)) {
                    const statusStr = columns[0];
                    const completed = statusStr.includes('[x]') || statusStr.includes('[X]');
                    const id = columns[1];
                    const testCase = columns[2];
                    const steps = columns[3] || '';
                    const expected = columns[4] || '';
                    const priority = columns[5] || '';

                    const text = steps ? `${testCase}: ${steps}` : testCase;

                    const newTask: any = {
                        id,
                        text,
                        completed,
                        module: currentModule.id,
                        hints: [] as string[]
                    };

                    if (expected) {
                        newTask.hints.push(`Expected: ${expected}`);
                    }
                    if (priority) {
                        newTask.hints.push(`Priority: ${priority}`);
                    }

                    currentModule.tasks.push(newTask);
                    lastTask = newTask;
                    continue;
                }
            }

            // 4. Check for Checkbox lists (Edge cases, Security, UX, etc.)
            const isCheckbox = trimmed.startsWith('- [');
            const isNumbered = /^\d+\.\s+/.test(trimmed);

            if (isCheckbox || isNumbered) {
                const completed = trimmed.startsWith('- [x]') || trimmed.startsWith('- [X]');

                // Try matching with bold blocks first: **ID**: Text
                let id = '';
                let text = '';

                const boldMatch = trimmed.match(/\[.\]\s*\*\*([^*:]+)(?::\s*([^*]+))?\*\*(.*)/);
                if (boldMatch) {
                    id = boldMatch[1].trim();
                    text = (boldMatch[2] ? `${boldMatch[2]}: ${boldMatch[3]}` : boldMatch[3]).trim();
                } else {
                    // Match standard ID: Text format: - [ ] A1: Text
                    const standardMatch = trimmed.match(/\[.\]\s*([A-Z]+0?\d*)[:\-]\s*(.*)/i);
                    if (standardMatch) {
                        id = standardMatch[1].trim();
                        text = standardMatch[2].trim();
                    } else if (isNumbered) {
                        const numMatch = trimmed.match(/^(\d+)\.\s*(.*)/);
                        if (numMatch) {
                            id = numMatch[1];
                            text = numMatch[2].trim();
                        }
                    } else {
                        // Fallback: just take everything after the checkbox
                        text = trimmed.replace(/^-\s*\[.\]\s*/, '').trim();
                        id = `T${currentModule.tasks.length + 1}`;
                    }
                }

                // Standardize Task ID
                let taskId = id;
                if (!/^[A-Z]\d+/.test(id) && !id.includes('-')) {
                    const modLetter = currentModule.id.split(' ').pop();
                    taskId = `${modLetter}${id.replace(/\D/g, '') || (currentModule.tasks.length + 1)}`;
                }

                const newTask: any = {
                    id: taskId,
                    text: text.replace(/^[:\s—-]+/, '').trim(),
                    completed,
                    module: currentModule.id,
                    hints: [] as string[]
                };

                // Final text cleanup
                if (!newTask.text) {
                    newTask.text = trimmed.replace(/^-\s*\[.\]\s*/, '').trim();
                }

                currentModule.tasks.push(newTask);
                lastTask = newTask;
                continue;
            }

            // 5. Check for Hints: Indented lines
            if (line.startsWith('    ') || line.startsWith('\t') || (line.startsWith(' ') && trimmed.startsWith('-'))) {
                if (lastTask && (trimmed.startsWith('-') || trimmed.match(/^[A-Z][a-z]+:/))) {
                    const hintText = trimmed.replace(/^- \*/, '').replace(/\*$/, '').replace(/^- /, '').trim();
                    if (hintText) {
                        lastTask.hints.push(hintText);
                    }
                }
            }
        }

        if (currentModule) modules.push(currentModule);

        return NextResponse.json({ modules });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
