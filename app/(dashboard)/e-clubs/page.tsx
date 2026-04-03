import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigWhereNotLegacyDummy } from "@/lib/legacyDummyGigs";
import { EClubsView } from "@/components/occ-dashboard/EClubsView";

export default async function EClubsPage() {
  const user = await requireUser();

  const gigs = await prisma.gig.findMany({
    where: { ...gigWhereNotLegacyDummy },
    orderBy: { createdAt: "desc" },
    include: {
      club: { select: { name: true, slug: true, icon: true } },
      postedBy: { select: { fullName: true } },
      applications: {
        where: { userId: user.id },
        select: { id: true, status: true },
      },
    },
  });

  const canPost =
    user.role === "CLUB_HEADER" && user.approvalStatus === "APPROVED" && !!user.clubManaged;

  return (
    <EClubsView
      gigs={gigs}
      canPost={canPost}
      userId={user.id}
      applicantProfile={{
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      }}
    />
  );
}
