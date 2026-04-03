import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventRegistrationSchema } from "@/lib/validations";
import { serverCache } from "@/lib/server-cache";

export async function GET() {
  const events = await serverCache.getOrSet("events:list", 15_000, () =>
    prisma.event.findMany({
      include: {
        club: true,
      },
      orderBy: { date: "asc" },
    }),
  );

  return NextResponse.json(
    { events },
    {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30",
      },
    },
  );
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { eventId } = eventRegistrationSchema.parse(body);

  await prisma.eventRegistration.upsert({
    where: {
      userId_eventId: {
        userId: user.id,
        eventId,
      },
    },
    update: {},
    create: {
      userId: user.id,
      eventId,
    },
  });

  return NextResponse.json({ success: true });
}
