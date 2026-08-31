import { NextResponse } from 'next/server';
import { queryPostgres, requireAuth, uploadBufferToS3 } from '@adsspot/api/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// Max file size: 15 MB
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
];

export async function POST(req: Request) {
  try {
    // 1. Parse Multipart Form Data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const formUserId = (formData.get('user_id') as string | null) || req.headers.get('x-user-id');
    const merchantId = formData.get('merchant_id') as string | null;
    const mediaModule = (formData.get('module') as string) || 'general';
    const visibility = (formData.get('visibility') as string) || 'public';

    // 2. Authenticate user from server session or verified database user
    let authenticatedUserId: string | null = null;
    const auth = await requireAuth(req);

    if (!auth.errorResponse && auth.context) {
      authenticatedUserId = auth.context.user.id;
    } else if (formUserId) {
      // Fallback: Verify user in PostgreSQL
      const userRes = await queryPostgres('SELECT id, role FROM users WHERE id = $1', [formUserId]);
      if (userRes?.rows && userRes.rows.length > 0) {
        authenticatedUserId = userRes.rows[0].id;
      }
    }

    if (!authenticatedUserId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Valid session or user credentials required to upload media.' },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided in form data' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File exceeds maximum allowed size of 15MB (Current: ${(file.size / 1024 / 1024).toFixed(2)}MB)` },
        { status: 400 }
      );
    }

    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { success: false, error: `Unsupported file type: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF, SVG, PDF.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageKey = `uploads/${mediaModule}/${Date.now()}-${sanitizedFileName}`;
    const mediaId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    let fileUrl: string | null = null;

    // 3. Try AWS S3 Upload
    try {
      fileUrl = await uploadBufferToS3(storageKey, buffer, mimeType);
    } catch (s3Err) {
      console.warn('[API /media/upload] S3 upload failed or not configured, writing to local storage:', s3Err);
    }

    // 4. Fallback to Local Public Server Storage if S3 is not configured
    if (!fileUrl) {
      const publicUploadDir = path.join(process.cwd(), 'public', 'uploads', mediaModule);
      if (!fs.existsSync(publicUploadDir)) {
        fs.mkdirSync(publicUploadDir, { recursive: true });
      }

      const localFilePath = path.join(publicUploadDir, `${Date.now()}-${sanitizedFileName}`);
      fs.writeFileSync(localFilePath, buffer);

      const relativeUrl = `/uploads/${mediaModule}/${path.basename(localFilePath)}`;
      fileUrl = relativeUrl;
    }

    // 5. Insert Media Record into PostgreSQL Aurora Database
    const insertRes = await queryPostgres(
      `INSERT INTO media (
        id, owner_id, merchant_id, file_name, storage_key, file_url, 
        mime_type, file_size, visibility, status, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active', NOW(), NOW())
      RETURNING *`,
      [
        mediaId,
        authenticatedUserId,
        merchantId || null,
        file.name,
        storageKey,
        fileUrl,
        mimeType,
        file.size,
        visibility,
      ]
    );

    const mediaRecord = insertRes?.rows[0] || {
      id: mediaId,
      owner_id: authenticatedUserId,
      merchant_id: merchantId || null,
      file_name: file.name,
      storage_key: storageKey,
      file_url: fileUrl,
      mime_type: mimeType,
      file_size: file.size,
      visibility,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      media: mediaRecord,
      file_url: fileUrl,
      message: 'File uploaded and persisted successfully.',
    });
  } catch (error: any) {
    console.error('[API /media/upload] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'File upload failed' }, { status: 500 });
  }
}
