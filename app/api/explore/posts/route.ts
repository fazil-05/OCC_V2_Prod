import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { displayPostLikes } from "@/lib/socialDisplay";

/** Realtime search for Explore: club header posts, keyword matches caption, content, club name/slug (e.g. “bikers”). */
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = (req.nextUrl.searchParams.get("q") || "").trim();

  const posts = await prisma.post.findMany({
    where: {
      hidden: false,
      user: { role: "CLUB_HEADER" },
      ...(q
        ? {
            OR: [
              { caption: { contains: q, mode: "insensitive" } },
              { content: { contains: q, mode: "insensitive" } },
              { club: { name: { contains: q, mode: "insensitive" } } },
              { club: { slug: { contains: q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    take: 50,
    include: { user: true, club: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      userId: p.userId,
      clubId: p.clubId,
      caption: p.caption,
      content: p.content,
      imageUrl: p.imageUrl,
      likesCount: displayPostLikes(p.id, p.likesCount ?? p.likes ?? 0),
      sharesCount: p.sharesCount ?? 0,
      createdAt: p.createdAt.toISOString(),
      user: {
        id: p.user.id,
        fullName: p.user.fullName,
        avatar: p.user.avatar,
      },
      club: p.club
        ? { id: p.club.id, name: p.club.name, slug: p.club.slug }
        : null,
    })),
  });
}
