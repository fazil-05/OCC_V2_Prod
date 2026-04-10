import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { notifyPostCommented } from "@/lib/post-engagement-notify";

/** Public comment payload — never include email, phone, or other PII (same for all roles). */
function publicCommentPayload(c: {
  id: string;
  content: string;
  createdAt: Date;
  user: { id: string; fullName: string; avatar: string | null };
}) {
  return {
    id: c.id,
    content: c.content,
    createdAt: c.createdAt,
    user: {
      id: c.user.id,
      fullName: c.user.fullName,
      avatar: c.user.avatar,
    },
  };
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const comments = await prisma.comment.findMany({
    where: { postId: params.id },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(comments.map(publicCommentPayload));
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) return NextResponse.json({ error: "Content required" }, { status: 400 });

  const comment = await prisma.comment.create({
    data: {
      postId: params.id,
      userId: user.id,
      content,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatar: true,
        },
      },
    },
  });

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { club: { select: { id: true, headerId: true } } },
  });
  const commentsCount = await prisma.comment.count({
    where: { postId: params.id },
  });

  const safeComment = publicCommentPayload(comment);

  const preview =
    content.length > 80 ? `${content.slice(0, 77)}…` : content;

  try {
    await pusherServer.trigger(`club-${post?.clubId}`, "new-comment", {
      postId: params.id,
      commentsCount,
      comment: safeComment,
    });
  } catch (e) {
    console.warn("[posts/comment] Pusher failed (non-critical):", e);
  }

  if (post?.clubId) {
    void notifyPostCommented({
      postId: params.id,
      clubId: post.clubId,
      headerId: post.club?.headerId ?? null,
      commenterId: user.id,
      commenterName: user.fullName,
      caption: post.caption,
      content: post.content,
      commentPreview: preview,
    });
  }

  return NextResponse.json({ success: true, comment: safeComment, commentsCount }, { status: 201 });
}
