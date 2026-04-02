import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ clubs: [] });
  }

  const clubs = await prisma.club.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ clubs });
}
