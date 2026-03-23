export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { UPLOAD_PATHS, validateFileMagicBytes, resolveUploadPath, getFileServeUrl, generateSafeFileName, MAX_FILE_SIZE, sanitizeImageBuffer, uploadToSupabase } from '@/lib/upload';

// Allowed image and document types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

/**
 * POST /api/upload
 * Generic upload endpoint (used by project creation forms)
 * Switches between Local Storage (Dev) and Supabase Storage (Production/Vercel)
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
                { success: false, error: 'file.invalidType', message: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.` },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: 'file.tooLarge', message: `File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
                { status: 400 }
            );
        }

        // Generate safe filename using UUID
        const fileName = generateSafeFileName(file.name);
        const uploadsDir = UPLOAD_PATHS.projects;
        const filePath = path.join(uploadsDir, fileName);
        
        let fileBuffer = Buffer.from(await file.arrayBuffer() as any);

        // Validate magic bytes match claimed MIME type
        if (!validateFileMagicBytes(fileBuffer, file.type)) {
            return NextResponse.json(
                { success: false, error: 'file.contentMismatch', message: 'File content does not match the declared file type. Please try a different image.' },
                { status: 400 }
            );
        }

        // Sanitize image (metadata stripping)
        fileBuffer = sanitizeImageBuffer(fileBuffer);
        
        // Detect Deployment Environment
        const isVercel = !!process.env.VERCEL || !!process.env.VERCEL_ENV;
        let url: string;

        if (isVercel) {
            console.log('Vercel detected, uploading to Supabase Storage...');
            const supabaseUrl = await uploadToSupabase('projects', fileName, fileBuffer, file.type);
            if (!supabaseUrl) {
                throw new Error('Supabase Storage upload failed. Ensure SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL are set in Vercel.');
            }
            url = supabaseUrl;
        } else {
            try {
                // Try Local Disk Storage (Default for development)
                if (!existsSync(uploadsDir)) {
                    await mkdir(uploadsDir, { recursive: true });
                }
                await writeFile(filePath, fileBuffer);
                url = getFileServeUrl('projects', fileName);
            } catch (writeError: any) {
                console.warn('Local storage failed, falling back to Supabase:', writeError.message);
                const cloudUrl = await uploadToSupabase('projects', fileName, fileBuffer, file.type);
                if (!cloudUrl) {
                    throw new Error(`Failed to save image locally or to cloud: ${writeError.message}`);
                }
                url = cloudUrl;
            }
        }

        console.log(`Successfully processed upload: ${fileName} -> ${url}`);

        return NextResponse.json(
            {
                success: true,
                message: 'File uploaded successfully.',
                data: { url },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Critical upload error:', error);
        const isDev = process.env.NODE_ENV === 'development';
        return NextResponse.json(
            { 
                success: false, 
                error: 'server.error', 
                message: isDev 
                    ? `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                    : 'An unexpected error occurred during upload. Please try again later.' 
            },
            { status: 500 }
        );
    }
}
