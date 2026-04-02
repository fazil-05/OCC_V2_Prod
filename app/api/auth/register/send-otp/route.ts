import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { generateSixDigitOtp, sha256Hex } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/smtp";

const sendOtpSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

type OtpPurpose = "REGISTER";

// Simple in-memory throttle to reduce OTP spam in dev.
const rateMap = (globalThis as any).__occOtpRateMap ?? ((globalThis as any).__occOtpRateMap = new Map());

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const { email } = sendOtpSchema.parse(await req.json());
    const purpose: OtpPurpose = "REGISTER";

    const key = `${purpose}:${email}`;
    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const maxPerWindow = 3;

    const prev = rateMap.get(key) as { count: number; resetAt: number } | undefined;
    if (prev && prev.resetAt > now && prev.count >= maxPerWindow) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const otp = generateSixDigitOtp();
    const expectedHash = sha256Hex(`${purpose}:${email}:${otp}`);

    // Remove prior unused codes to keep verification deterministic.
    await prisma.emailOtpToken.deleteMany({
      where: {
        email,
        purpose: "REGISTER",
        usedAt: null,
        expiresAt: { gt: new Date(Date.now() - windowMs) },
      },
    });

    await prisma.emailOtpToken.create({
      data: {
        email,
        purpose,
        codeHash: expectedHash,
        attemptsLeft: 5,
        expiresAt: new Date(Date.now() + 10 * 60_000), // 10 minutes
      },
    });

    // Update throttle counter.
    const resetAt = now + windowMs;
    rateMap.set(key, { count: (prev?.count ?? 0) + 1, resetAt });

    await sendOtpEmail({ to: email, code: otp, purpose: "REGISTER" });

    // Do not reveal whether email exists.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Invalid email" },
        { status: 400 },
      );
    }
    console.error("[register/send-otp]", error);
    return NextResponse.json({ error: "OTP send failed" }, { status: 500 });
  }
}

