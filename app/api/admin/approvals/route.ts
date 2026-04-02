import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await requireAdminApi();
  if (user instanceof NextResponse) return user;

  const approvals = await prisma.user.findMany({
    where: { role: "CLUB_HEADER", approvalStatus: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { clubManaged: true },
  });

  return NextResponse.json({ approvals });
}
