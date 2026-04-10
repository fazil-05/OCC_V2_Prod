import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sha256Hex } from "@/lib/otp";

const verifyOtpSchema = z.object({
  email: z.string().email("Enter a valid email"),
  otp: z.string().regex(/^\d{6}$/, "OTP must be a 6-digit number"),
});

/** Verifies reset OTP without consuming it; password reset endpoint consumes it. */
export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
    const { email, otp } = verifyOtpSchema.parse(await req.json());
    const purpose = "RESET_PASSWORD" as const;

    const latestOtpToken = await prisma.emailOtpToken.findFirst({
      where: {
        email,
        purpose,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!latestOtpToken || latestOtpToken.attemptsLeft <= 0) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    const expectedHash = sha256Hex(`${purpose}:${email}:${otp}`);
    if (expectedHash !== latestOtpToken.codeHash) {
      const nextAttempts = Math.max(0, latestOtpToken.attemptsLeft - 1);
      await prisma.emailOtpToken.update({
        where: { id: latestOtpToken.id },
        data: {
          attemptsLeft: nextAttempts,
          usedAt: nextAttempts === 0 ? new Date() : null,
        },
      });
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "OTP verification failed" }, { status: 500 });
  }
}

