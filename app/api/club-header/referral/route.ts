import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "CLUB_HEADER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    referralCode: user.referralCode,
    approved: user.approvalStatus === "APPROVED",
    club: user.clubManaged,
  });
}
