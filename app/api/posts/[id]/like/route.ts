import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { displayPostLikes } from "@/lib/socialDisplay";
import { notifyPostLiked } from "@/lib/post-engagement-notify";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const postRow = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      hidden: true,
      caption: true,
      content: true,
      clubId: true,
      club: { select: { headerId: true } },
    },
  });
  if (!postRow || postRow.hidden) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const existing = await prisma.postLike.findUnique({
    where: { postId_userId: { postId: params.id, userId: user.id } },
  });

  const addedLike = !existing;

  if (existing) {
    await prisma.postLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.postLike.create({ data: { postId: params.id, userId: user.id } });
  }

  const realLikes = await prisma.postLike.count({ where: { postId: params.id } });
  await prisma.post.update({
    where: { id: params.id },
    data: { likesCount: realLikes, likes: realLikes },
  });

  const likesCount = displayPostLikes(params.id, realLikes);
  const action = addedLike ? "like" : "unlike";

  try {
    await pusherServer.trigger(`club-${postRow.clubId}`, "new-like", {
      postId: params.id,
      likesCount,
      actorUserId: user.id,
      actorName: user.fullName,
      action,
    });
  } catch (e) {
    console.warn("[posts/like] Pusher failed (non-critical):", e);
  }

  if (addedLike) {
    void notifyPostLiked({
      postId: params.id,
      clubId: postRow.clubId,
      headerId: postRow.club?.headerId ?? null,
      likerId: user.id,
      likerName: user.fullName,
      caption: postRow.caption,
      content: postRow.content,
    });
  }

  return NextResponse.json({ success: true, likesCount, liked: addedLike });
}
