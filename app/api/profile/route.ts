import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validations";

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

  try {
    const body = await req.json();
    const parsed = profileUpdateSchema.parse(body);

    const data: Prisma.UserUpdateInput = {
      fullName: parsed.fullName,
      collegeName: parsed.collegeName,
      bio: parsed.bio === "" || parsed.bio === undefined ? null : parsed.bio,
      city: parsed.city === "" || parsed.city === undefined ? null : parsed.city,
    };

    if (parsed.graduationYear !== undefined) {
      data.graduationYear = parsed.graduationYear;
    }
    if (parsed.avatar !== undefined) {
      data.avatar = parsed.avatar === "" ? null : parsed.avatar;
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid form data" },
        { status: 400 },
      );
    }
    console.error("[profile] PATCH", error);
    return NextResponse.json({ error: "Could not update profile" }, { status: 500 });
  }
}
