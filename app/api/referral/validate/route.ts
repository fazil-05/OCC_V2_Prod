import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { referralValidateSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code } = referralValidateSchema.parse(body);

  const header = await prisma.user.findUnique({
    where: { referralCode: code },
    include: { clubManaged: true },
  });

  if (!header || header.approvalStatus !== "APPROVED") {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    club: header.clubManaged,
    headerName: header.fullName,
    headerId: header.id,
  });
}
