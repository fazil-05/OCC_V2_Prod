import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { isR2Configured, uploadBufferToR2 } from "@/lib/r2";

async function saveToLocalDisk(userId: string, ext: string, bytes: Buffer): Promise<string> {
  const shortName = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", userId);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, shortName), bytes);
  return `/uploads/${userId}/${shortName}`;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file || !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "No valid image file provided" }, { status: 400 });
  }

  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const bytes = Buffer.from(await file.arrayBuffer());
  const isDev = process.env.NODE_ENV === "development";

  // 1) Cloudflare R2
  if (isR2Configured()) {
    const key = `posts/${user.id}/${randomUUID()}.${ext}`;
    try {
      const url = await uploadBufferToR2({
        key,
        body: bytes,
        contentType: file.type || "image/jpeg",
      });
      return NextResponse.json({ success: true, url });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[upload] R2 failed:", e);
      if (isDev) {
        try {
          const url = await saveToLocalDisk(user.id, ext, bytes);
          console.warn(
            "[upload] Dev fallback: saved to disk (fix R2 env/token). Error was:",
            msg,
          );
          return NextResponse.json({
            success: true,
            url,
            warning:
              "Uploaded to local /uploads (R2 failed — check R2 token permissions, Account ID, and terminal log).",
          });
        } catch (localErr) {
          console.error("[upload] Local fallback failed:", localErr);
        }
      }
      return NextResponse.json(
        {
          error: "Image upload failed (R2). Check Account ID, API token (Read+Write), and bucket name.",
          detail: isDev ? msg : undefined,
        },
        { status: 500 },
      );
    }
  }

  // 2) Vercel Blob
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const fileName = `posts/${user.id}/${randomUUID()}.${ext}`;
      const blob = await put(fileName, file, {
        access: "public",
        contentType: file.type || "image/jpeg",
      });
      return NextResponse.json({ success: true, url: blob.url });
    } catch (e) {
      console.error("[upload] Blob failed:", e);
      if (isDev) {
        try {
          const url = await saveToLocalDisk(user.id, ext, bytes);
          return NextResponse.json({
            success: true,
            url,
            warning: "Uploaded locally (Vercel Blob failed).",
          });
        } catch {
          /* fall through */
        }
      }
      return NextResponse.json({ error: "Image upload failed (Blob)." }, { status: 500 });
    }
  }

  // 3) Local disk — development without R2/Blob
  if (isDev) {
    try {
      const url = await saveToLocalDisk(user.id, ext, bytes);
      return NextResponse.json({ success: true, url });
    } catch (e) {
      console.error("[upload] Local write failed:", e);
      return NextResponse.json(
        { error: "Could not write to public/uploads.", detail: e instanceof Error ? e.message : String(e) },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    {
      error:
        "Image uploads are not configured. Set R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_BASE_URL) or BLOB_READ_WRITE_TOKEN.",
    },
    { status: 503 },
  );
}
