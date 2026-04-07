import type { Club, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { REFERRAL_CODE_MIN_LEN } from "@/lib/validations";

/**
 * Normalizes referral input: NFC, strips spaces/zero-width chars, uppercases.
 * Fixes mismatches vs DB when users paste codes or DB has odd spacing.
 */
export function normalizeReferralCodeInput(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\s\u200b-\u200d\ufeff]/g, "")
    .toUpperCase();
}

export type ResolvedClubHeader = {
  header: User & { clubManaged: Club | null };
  club: Club;
};

/**
 * Finds an approved club leader whose referral code matches (exact or normalized).
 */
export async function resolveClubHeaderByReferralCode(
  codeInput: string,
): Promise<ResolvedClubHeader | null> {
  const normalized = normalizeReferralCodeInput(codeInput);
  if (normalized.length < REFERRAL_CODE_MIN_LEN) {
    return null;
  }

  let header =
    (await prisma.user.findUnique({
      where: { referralCode: normalized },
      include: { clubManaged: true },
    })) ?? null;

  if (
    header &&
    (header.role !== "CLUB_HEADER" || header.approvalStatus !== "APPROVED")
  ) {
    header = null;
  }

  if (!header) {
    const candidates = await prisma.user.findMany({
      where: {
        role: "CLUB_HEADER",
        approvalStatus: "APPROVED",
        referralCode: { not: null },
      },
      include: { clubManaged: true },
    });

    const matched = candidates.find(
      (u) =>
        u.referralCode !== null &&
        normalizeReferralCodeInput(u.referralCode) === normalized,
    );

    header = matched ?? null;
  }

  if (!header || header.role !== "CLUB_HEADER" || header.approvalStatus !== "APPROVED") {
    return null;
  }

  const club =
    header.clubManaged ??
    (await prisma.club.findFirst({ where: { headerId: header.id } }));

  if (!club) {
    return null;
  }

  return { header, club };
}
