import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let cached: S3Client | null = null;

/** All of: account id, keys, bucket, public base URL for reads. */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID?.trim() &&
    process.env.R2_ACCESS_KEY_ID?.trim() &&
    process.env.R2_SECRET_ACCESS_KEY?.trim() &&
    process.env.R2_BUCKET_NAME?.trim() &&
    process.env.R2_PUBLIC_BASE_URL?.trim()
  );
}

function getR2Client(): S3Client {
  if (cached) return cached;
  const accountId = process.env.R2_ACCOUNT_ID!;
  cached = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    /** R2 expects path-style URLs: endpoint/bucket/key (see Cloudflare R2 S3 API docs). */
    forcePathStyle: true,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  return cached;
}

/** Upload bytes; returns public HTTPS URL (R2 custom domain or r2.dev). */
export async function uploadBufferToR2(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME!;
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );
  const base = process.env.R2_PUBLIC_BASE_URL!.replace(/\/$/, "");
  return `${base}/${params.key}`;
}

export function r2ObjectKeyFromPublicUrl(url: string): string | null {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (!base) return null;
  if (!url.startsWith(`${base}/`)) return null;
  return url.slice(base.length + 1);
}

/** Best-effort delete when the URL was stored from this R2 bucket. */
export async function deleteR2ObjectByPublicUrl(url: string | null | undefined): Promise<void> {
  if (!url || !isR2Configured()) return;
  const key = r2ObjectKeyFromPublicUrl(url);
  if (!key) return;
  try {
    await getR2Client().send(
      new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      }),
    );
  } catch (e) {
    console.warn("[r2] DeleteObject failed:", e);
  }
}
