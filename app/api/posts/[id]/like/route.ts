import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { displayPostLikes } from "@/lib/socialDisplay";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId: params.id, userId: user.id } },
  });

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({ data: { postId: params.id, userId: user.id } });
  }

  const realLikes = await prisma.postLike.count({ where: { postId: params.id } });
  const post = await prisma.post.update({
    where: { id: params.id },
    data: { likesCount: realLikes, likes: realLikes },
    select: { clubId: true },
  });

  const likesCount = displayPostLikes(params.id, realLikes);
  await pusherServer.trigger(`club-${post.clubId}`, "new-like", { postId: params.id, likesCount });
  return NextResponse.json({ success: true, likesCount });
}
