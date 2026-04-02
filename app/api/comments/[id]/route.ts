import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const comment = await prisma.comment.findUnique({
    where: { id: params.id },
    include: { post: { include: { club: true } } }
  });

  if (!comment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Admin OR Club Header of the post's club OR the comment author
  const isAdmin = user.role === "ADMIN";
  const isClubHeader = user.role === "CLUB_HEADER" && comment.post.club.managedById === user.id;
  const isAuthor = comment.userId === user.id;

  if (!isAdmin && !isClubHeader && !isAuthor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await prisma.comment.delete({ where: { id: params.id } });
  
  return NextResponse.json({ success: true, message: "Comment deleted" });
}

// REPORT
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const reason = typeof body.reason === "string" ? body.reason.trim() : "General Report";

  await prisma.commentReport.create({
    data: {
      commentId: params.id,
      reporterId: user.id,
      reason
    }
  });

  return NextResponse.json({ success: true, message: "Report submitted to admin" });
}
