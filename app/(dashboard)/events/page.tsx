import { EventCard } from "@/components/dashboard/EventCard";
import { RegisterEventButton } from "@/components/dashboard/RegisterEventButton";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function EventsPage() {
  const user = await requireUser();
  const events = await prisma.event.findMany({
    include: {
      club: true,
      registrations: {
        where: { userId: user.id },
        select: { id: true },
      },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.45em] text-[#C9A96E]">Events</p>
        <h1 className="font-headline text-5xl text-[#F5F0E8]">Upcoming Calendar</h1>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            action={<RegisterEventButton eventId={event.id} registered={event.registrations.length > 0} />}
          />
        ))}
      </div>
    </div>
  );
}
