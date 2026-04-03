import { notFound } from "next/navigation";
import Link from "next/link";
import { ClubTabs } from "@/components/dashboard/ClubTabs";
import { JoinClubButton } from "@/components/dashboard/JoinClubButton";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gigWhereNotLegacyDummy } from "@/lib/legacyDummyGigs";
import { displayClubMembers, displayPostLikes, formatSocialCount } from "@/lib/socialDisplay";

const CINEMATIC_SLUGS: Record<string, { route: string; label: string; gradient: string }> = {
  bikers:      { route: "/bikers",      label: "Bikers Ride",    gradient: "from-amber-900/40 via-[#0C0C0A] to-orange-950/30" },
  sports:      { route: "/football",    label: "Football Club",  gradient: "from-green-900/40 via-[#060606] to-emerald-950/30" },
  photography: { route: "/photography", label: "Photography",    gradient: "from-yellow-900/30 via-[#0a0a0a] to-amber-950/20" },
  fashion:     { route: "/fashion",     label: "Fashion Club",   gradient: "from-indigo-900/30 via-[#050505] to-purple-950/20" },
};

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
      AND: [
        { ...gigWhereNotLegacyDummy },
        { OR: [{ clubId: club.id }, { clubId: null }] },
      ],
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
      {CINEMATIC_SLUGS[club.slug] ? (
        <Link
          href={CINEMATIC_SLUGS[club.slug].route}
          className={`group flex items-center justify-between rounded-[24px] border border-white/8 bg-gradient-to-br ${CINEMATIC_SLUGS[club.slug].gradient} p-6 sm:p-8 transition-all hover:border-white/15 hover:scale-[1.005]`}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#C9A96E] mb-2">Scroll Cinema</p>
            <h3 className="font-headline text-xl sm:text-2xl text-[#F5F0E8] tracking-wide">
              Experience {CINEMATIC_SLUGS[club.slug].label}
            </h3>
            <p className="mt-1 text-xs text-[#8A8478]">Full-screen scroll animation &amp; cinematic intro</p>
          </div>
          <span className="text-[#C9A96E] text-2xl transition-transform group-hover:translate-x-1">→</span>
        </Link>
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
              {formatSocialCount(displayClubMembers(club.id, club.memberCount || club.members.length))}{" "}
              members
            </span>
            <JoinClubButton slug={club.slug} joined={joined} />
          </div>
        </div>
      </section>

      <ClubTabs
        posts={club.posts.map((p) => ({
          ...p,
          likes: displayPostLikes(p.id, p.likesCount ?? p.likes ?? 0),
        }))}
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
