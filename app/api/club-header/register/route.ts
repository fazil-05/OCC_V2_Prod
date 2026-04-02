import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clubHeaderRegisterSchema } from "@/lib/validations";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = clubHeaderRegisterSchema.parse(body);

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: payload.email }, { phoneNumber: payload.phoneNumber }] },
      select: { id: true, role: true, approvalStatus: true },
    });
    if (existing) {
      if (existing.role === "CLUB_HEADER" && existing.approvalStatus === "PENDING") {
        return NextResponse.json(
          { error: "Application already submitted! Please wait for admin approval, then login at /login." },
          { status: 409 }
        );
      }
      if (existing.role === "CLUB_HEADER" && existing.approvalStatus === "APPROVED") {
        return NextResponse.json(
          { error: "Your application is already approved! Please login at /login to access your dashboard." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this email or phone already exists. Try logging in instead." },
        { status: 409 }
      );
    }

    const club = await prisma.club.findUnique({ where: { slug: payload.clubSlug } });
    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 });
    }

    const user = await prisma.user.create({
      data: {
        fullName: payload.fullName,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        collegeName: payload.collegeName,
        password: await bcrypt.hash(payload.password, 12),
        role: "CLUB_HEADER",
        approvalStatus: "PENDING",
        bio: payload.experience,
        city: payload.instagramHandle ? `Instagram: ${payload.instagramHandle}` : undefined,
      },
      select: { id: true, fullName: true, email: true },
    });

    await prisma.club.update({
      where: { id: club.id },
      data: { headerId: user.id },
    });

    // Notify admin panel in real-time (non-blocking — don't crash if Pusher isn't configured)
    try {
      await pusherServer.trigger("admin", "new-application", {
        application: { id: user.id, fullName: user.fullName, email: user.email, club: payload.clubSlug },
      });
    } catch (pusherErr) {
      console.warn("[club-header/register] Pusher notification failed (non-critical):", pusherErr);
    }

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (error) {
    console.error("[club-header/register] error", error);
    return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
  }
}
