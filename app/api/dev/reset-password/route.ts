import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * DEV-ONLY: Reset a club header's password by email.
 * DELETE this file in production!
 */
export async function POST(req: NextRequest) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Email and newPassword (min 6 chars) required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, fullName: true, approvalStatus: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({
      success: true,
      message: `Password reset for ${user.fullName} (${user.role}, ${user.approvalStatus})`,
    });
  } catch (error) {
    console.error("[dev/reset-password] error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
