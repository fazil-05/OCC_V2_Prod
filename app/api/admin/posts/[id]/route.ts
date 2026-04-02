import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher";

const patchSchema = z.object({
  hidden: z.boolean().optional(),
  pinned: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const parsed = patchSchema.parse(await req.json().catch(() => ({})));
  const post = await prisma.post.update({
    where: { id: params.id },
    data: parsed,
    select: { id: true, clubId: true, hidden: true },
  });

  await pusherServer.trigger(`club-${post.clubId}`, "post-updated", { postId: post.id, hidden: post.hidden });
  return NextResponse.json({ success: true, post });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const existing = await prisma.post.findUnique({ where: { id: params.id }, select: { clubId: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.post.delete({ where: { id: params.id } });
  await pusherServer.trigger(`club-${existing.clubId}`, "post-deleted", { postId: params.id });
  return NextResponse.json({ success: true });
}
