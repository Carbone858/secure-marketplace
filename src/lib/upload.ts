import path from 'path';
import crypto from 'crypto';

/**
 * Upload utility - centralized upload path and security helpers
 * Files are stored OUTSIDE public/ to prevent unauthenticated access
 */

// Base upload directory - NOT inside public/
export const UPLOAD_BASE = path.join(process.cwd(), 'data', 'uploads');

export const UPLOAD_PATHS = {
  documents: path.join(UPLOAD_BASE, 'documents'),
  avatars: path.join(UPLOAD_BASE, 'avatars'),
  projects: path.join(UPLOAD_BASE, 'projects'),
} as const;

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Magic bytes for file type validation
const FILE_SIGNATURES: Record<string, number[][]> = {
  'application/pdf': [[0x25, 0x50, 0x44, 0x46]], // %PDF
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF (WebP starts with RIFF)
};

/**
 * Validate file content matches claimed MIME type via magic bytes
 */
export function validateFileMagicBytes(buffer: Buffer, claimedType: string): boolean {
  const signatures = FILE_SIGNATURES[claimedType];
  if (!signatures) return false;

  return signatures.some((signature) =>
    signature.every((byte, index) => buffer[index] === byte)
  );
}

/**
 * Generate a safe, random filename using UUID to prevent naming collisions
 * and hide original file information.
 */
export function generateSafeFileName(originalName: string): string {
  const extension = path.extname(originalName).toLowerCase();
  const uuid = crypto.randomUUID();
  // Only allow alphanumeric extensions for safety
  const safeExt = /^\.[a-z0-9]+$/.test(extension) ? extension : '';
  return `${uuid}${safeExt}`;
}

/**
 * Resolve a safe file path within the upload directory.
 * Prevents path traversal attacks.
 */
export function resolveUploadPath(category: 'documents' | 'avatars' | 'projects', fileName: string): string | null {
  const basePath = UPLOAD_PATHS[category];
  const resolved = path.resolve(basePath, path.basename(fileName));

  // Ensure resolved path is within the expected directory
  if (!resolved.startsWith(basePath)) {
    return null;
  }

  return resolved;
}

/**
 * Get the API URL for serving an uploaded file (auth-protected)
 */
export function getFileServeUrl(category: 'documents' | 'avatars' | 'projects', fileName: string): string {
  return `/api/files/${category}/${encodeURIComponent(fileName)}`;
}

/**
 * Simple "sanitizer" for image buffers to help strip basic metadata 
 * or at least identify suspicious content.
 * Real EXIF stripping usually requires libraries like 'sharp' or 'exiftool'.
 */
export function sanitizeImageBuffer(buffer: Buffer): Buffer {
  // For now, this is a placeholder for metadata stripping.
  // In a real prod environment with 'sharp', we would use .keepMetadata(false)
  return buffer;
}
