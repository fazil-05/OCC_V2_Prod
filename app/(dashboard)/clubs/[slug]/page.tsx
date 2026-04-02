import { notFound } from "next/navigation";
import { ClubExperience } from "@/components/dashboard/ClubExperience";
import { ClubTabs } from "@/components/dashboard/ClubTabs";
import { JoinClubButton } from "@/components/dashboard/JoinClubButton";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ClubDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await requireUser();

  const club = await prisma.club.findUnique({
    where: { slug: params.slug },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      events: {
        include: {
          club: true,
          registrations: {
            where: { userId: user.id },
            select: { id: true },
          },
        },
        orderBy: { date: "asc" },
      },
      posts: {
        include: {
          club: true,
          user: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!club) {
    notFound();
  }

  const joined = club.members.some((membership) => membership.userId === user.id);
  const gigs = await prisma.gig.findMany({
    where: {
      OR: [{ clubId: club.id }, { clubId: null }],
    },
    include: {
      applications: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <div className="space-y-8 pb-10">
      {["bikers", "sports", "photography", "fashion"].includes(club.slug) ? (
        <div className="overflow-hidden rounded-[32px] border border-white/8">
          <ClubExperience slug={club.slug} />
        </div>
      ) : null}

      <section className="sticky top-0 z-30 rounded-[24px] border border-white/8 bg-[#0C0C0A]/90 p-5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">{club.icon} Club</p>
            <h1 className="font-headline text-4xl text-[#F5F0E8]">{club.name}</h1>
            <p className="max-w-2xl text-sm text-[#8A8478]">{club.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full border border-white/8 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#F5F0E8]/75">
              {club.memberCount || club.members.length} members
            </span>
            <JoinClubButton slug={club.slug} joined={joined} />
          </div>
        </div>
      </section>

      <ClubTabs
        posts={club.posts}
        events={club.events.map((event) => ({
          ...event,
          registered: event.registrations.length > 0,
        }))}
        members={club.members.map((membership) => membership.user)}
        gigs={gigs.map((gig) => ({
          ...gig,
          applied: gig.applications.length > 0,
        }))}
      />
    </div>
  );
}
