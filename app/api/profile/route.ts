import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.parse(body);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      fullName: parsed.fullName,
      collegeName: parsed.collegeName,
      phoneNumber: parsed.phoneNumber,
      bio: parsed.bio || null,
      city: parsed.city || null,
      graduationYear: parsed.graduationYear,
    },
  });

  return NextResponse.json({ success: true, user: updated });
}
