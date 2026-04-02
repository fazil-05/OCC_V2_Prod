import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/referral";
import { pusherServer } from "@/lib/pusher";

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const target = await prisma.user.findUnique({
    where: { id: params.id },
    include: { clubManaged: true },
  });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  if (target.role !== "CLUB_HEADER" || target.approvalStatus !== "PENDING") {
    return NextResponse.json({ error: "Not a pending club header application" }, { status: 400 });
  }

  let code = generateReferralCode(target.clubManaged?.name || "CLB", target.fullName);
  for (let i = 0; i < 8; i++) {
    const exists = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!exists) break;
    code = generateReferralCode(target.clubManaged?.name || "CLB", target.fullName);
  }

  await prisma.user.update({
    where: { id: target.id },
    data: { approvalStatus: "APPROVED", referralCode: code },
  });

  await prisma.notification.create({
    data: {
      userId: target.id,
      type: "approval",
      title: "Application approved",
      message: `You are approved. Your referral code is ${code}`,
      data: { referralCode: code },
    },
  });

  // Real-time notification (non-blocking — don't crash if Pusher isn't configured)
  try {
    await pusherServer.trigger(`user-${target.id}`, "approved", {
      referralCode: code,
      message: "Your application is approved.",
    });
  } catch (pusherErr) {
    console.warn("[admin/approve] Pusher notification failed (non-critical):", pusherErr);
  }

  return NextResponse.json({ success: true, referralCode: code });
}
