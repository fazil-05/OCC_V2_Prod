import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigApplicationSchema } from "@/lib/validations";

export async function GET() {
  const gigs = await prisma.gig.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ gigs });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { gigId } = gigApplicationSchema.parse(body);

  await prisma.gigApplication.upsert({
    where: {
      userId_gigId: {
        userId: user.id,
        gigId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      gigId,
    },
  });

  return NextResponse.json({ success: true });
}
