import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { UPLOAD_PATHS, validateFileMagicBytes, resolveUploadPath, getFileServeUrl, generateSafeFileName, MAX_FILE_SIZE, sanitizeImageBuffer } from '@/lib/upload';

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/upload
 * Generic upload endpoint (used by project creation forms)
 * Currently saving to 'projects' category
 */
export async function POST(request: NextRequest) {
    try {
        // Parse form data
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'file.missing', message: 'No file provided.' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'file.invalidType', message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: 'file.tooLarge', message: `File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
                { status: 400 }
            );
        }

        // Generate safe filename using UUID
        const fileName = generateSafeFileName(file.name);

        // Ensure uploads directory exists
        const uploadsDir = UPLOAD_PATHS.projects;
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadsDir, fileName);
        let fileBuffer = Buffer.from(await file.arrayBuffer() as any);

        // Validate magic bytes match claimed MIME type
        if (!validateFileMagicBytes(fileBuffer, file.type)) {
            return NextResponse.json(
                { success: false, error: 'file.contentMismatch', message: 'File content does not match the declared file type.' },
                { status: 400 }
            );
        }

        // Sanitize image (metadata stripping)
        fileBuffer = sanitizeImageBuffer(fileBuffer);
        await writeFile(filePath, fileBuffer);

        // Generate URL served via /api/files/...
        const url = getFileServeUrl('projects', fileName);

        return NextResponse.json(
            {
                success: true,
                message: 'File uploaded successfully.',
                data: { url },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { success: false, error: 'server.error', message: 'An unexpected error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
