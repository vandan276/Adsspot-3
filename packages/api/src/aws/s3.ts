import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';


const AWS_REGION = process.env.APP_AWS_REGION || process.env.AWS_REGION || 'ap-south-1';
const S3_BUCKET = process.env.APP_AWS_S3_BUCKET || process.env.AWS_S3_BUCKET || 'adsspot-media-prod';
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || '';

let s3ClientInstance: S3Client | null = null;

export const getS3Client = (): S3Client | null => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null;
  }

  if (!s3ClientInstance) {
    s3ClientInstance = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  return s3ClientInstance;
};

/**
 * Generate Presigned Upload URL for direct client-side S3 media uploads (images, banners, stories)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds: number = 300
): Promise<{ uploadUrl: string; cdnUrl: string } | null> {
  const client = getS3Client();
  if (!client) {
    return null;
  }

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  const cdnUrl = CLOUDFRONT_DOMAIN
    ? `${CLOUDFRONT_DOMAIN.replace(/\/$/, '')}/${key}`
    : `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;

  return { uploadUrl, cdnUrl };
}

/**
 * Direct server-side upload buffer to Amazon S3
 */
export async function uploadBufferToS3(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string | null> {
  const client = getS3Client();
  if (!client) {
    return null;
  }

  await client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return CLOUDFRONT_DOMAIN
    ? `${CLOUDFRONT_DOMAIN.replace(/\/$/, '')}/${key}`
    : `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
}
