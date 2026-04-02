import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventRegistrationSchema } from "@/lib/validations";

export async function GET() {
  const events = await prisma.event.findMany({
    include: {
      club: true,
    },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ events });
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
