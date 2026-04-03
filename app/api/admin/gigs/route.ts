import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigWhereNotLegacyDummy } from "@/lib/legacyDummyGigs";

/** Full gig + application pipeline for staff oversight. */
export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const gigs = await prisma.gig.findMany({
    where: { ...gigWhereNotLegacyDummy },
    orderBy: { createdAt: "desc" },
    include: {
      club: { select: { id: true, name: true, slug: true } },
      postedBy: { select: { id: true, fullName: true, email: true } },
      applications: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return NextResponse.json({ gigs });
}
