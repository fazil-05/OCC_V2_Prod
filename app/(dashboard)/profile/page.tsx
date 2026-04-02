import { ClubCard } from "@/components/dashboard/ClubCard";
import { EventCard } from "@/components/dashboard/EventCard";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const user = await requireUser();
  const [clubs, events] = await Promise.all([
    prisma.club.findMany({
      where: {
        members: {
          some: { userId: user.id },
        },
      },
    }),
    prisma.eventRegistration.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            club: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const initials = user.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 px-4 sm:px-0 pt-2">
      <GlassCard className="sm:rounded-[32px] p-5 sm:p-8 border-x-0 sm:border border-black/[0.04]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="flex h-16 w-16 sm:h-24 sm:w-24 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#C9A96E,#8D6A24)] text-xl sm:text-3xl text-[#0C0C0A] font-black shadow-xl">
              {initials}
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="font-sans text-2xl sm:text-5xl font-black text-black tracking-tighter uppercase">{user.fullName}</h1>
              <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#D4AF37] font-bold">{user.collegeName}</p>
              <p className="text-[11px] sm:text-sm text-black/30 font-medium">Joined {user.createdAt.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {[
              { label: "Clubs", value: clubs.length },
              { label: "Events", value: events.length },
              { label: "Gigs", value: user.gigsApplied.length },
            ].map((item) => (
              <div key={item.label} className="rounded-xl sm:rounded-2xl border border-black/[0.03] bg-black/[0.01] px-3 sm:px-4 py-2 sm:py-3 shadow-inner">
                <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/30 font-black">{item.label}</p>
                <p className="mt-1 sm:mt-2 text-lg sm:text-2xl text-black font-black">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard className="sm:rounded-[28px] p-5 sm:p-6 border-x-0 sm:border border-black/[0.04]">
          <div className="mb-6 space-y-1 sm:space-y-2">
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#D4AF37] font-black">Identity Management</p>
            <h2 className="font-sans text-xl sm:text-3xl font-black text-black tracking-tight uppercase">Your Details</h2>
          </div>
          <ProfileForm
            initialValues={{
              fullName: user.fullName,
              collegeName: user.collegeName,
              phoneNumber: user.phoneNumber,
              bio: user.bio ?? "",
              city: user.city ?? "",
              graduationYear: user.graduationYear ?? undefined,
            }}
          />
        </GlassCard>

        <div className="space-y-8 sm:space-y-6">
          <div className="space-y-4">
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#D4AF37] font-black px-1">My Clusters</p>
            <div className="grid gap-4">
              {clubs.map((club) => (
                <ClubCard 
                  key={club.id} 
                  club={{
                    ...club,
                    coverImage: club.coverImage ?? undefined
                  }} 
                  joined 
                />
              ))}
            </div>

          </div>
          <div className="space-y-4">
            <p className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.45em] text-[#D4AF37] font-black px-1">Active Events</p>
            <div className="grid gap-4">
              {events.map(({ event }) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}
