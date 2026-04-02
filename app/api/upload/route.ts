import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

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

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const fileName = `avatars/${user.id}/${randomUUID()}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ success: true, url: blob.url });
  }

  const shortName = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads", user.id);
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  await writeFile(join(uploadDir, shortName), Buffer.from(bytes));

  const url = `/uploads/${user.id}/${shortName}`;
  return NextResponse.json({ success: true, url });
}
