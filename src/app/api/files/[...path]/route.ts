import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-session/session';
import { resolveUploadPath } from '@/lib/upload';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface RouteParams {
  params: { path: string[] };
}

// MIME type map
const MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * GET /api/files/[...path]
 * Serve uploaded files with authentication
 * Path format: /api/files/{category}/{filename}
 * e.g., /api/files/documents/companyId_type_hash.pdf
 *       /api/files/avatars/userId_hash.png
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession();

    // Avatars can be publicly viewed (profile pictures)
    // Documents require authentication
    const pathSegments = params.path;

    if (!pathSegments || pathSegments.length !== 2) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    const [category, fileName] = pathSegments;

    if (category !== 'documents' && category !== 'avatars' && category !== 'projects') {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Documents require authentication; avatars are semi-public
    if (category === 'documents') {
      if (!session.isAuthenticated) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Resolve path safely (prevents traversal)
    const filePath = resolveUploadPath(category, fileName);
    if (!filePath) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    const ext = path.extname(fileName).toLowerCase().replace('.', '');
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(fileBuffer.length),
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('File serve error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
