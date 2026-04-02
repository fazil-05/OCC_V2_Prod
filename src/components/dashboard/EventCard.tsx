import { format } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

export function EventCard({
  event,
  action,
}: {
  event: {
    title: string;
    description: string;
    venue: string;
    date: Date | string;
    imageUrl?: string | null;
    club?: { name: string; icon: string } | null;
    price?: number;
  };
  action?: React.ReactNode;
}) {
  const date = typeof event.date === "string" ? new Date(event.date) : event.date;

  return (
    <GlassCard className="overflow-hidden rounded-[24px] p-0">
      <div
        className="h-44 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(12,12,10,0.08), rgba(12,12,10,0.75)), url(${event.imageUrl ?? "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80"})`,
        }}
      />
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            {event.club ? (
              <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#C9A96E]">
                {event.club.icon} {event.club.name}
              </span>
            ) : null}
            <h3 className="mt-3 font-headline text-2xl text-[#F5F0E8]">{event.title}</h3>
          </div>
          <span className="rounded-full bg-[#C9A96E]/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#C9A96E]">
            {format(date, "dd MMM")}
          </span>
        </div>
        <p className="text-sm leading-6 text-[#A9A294]">{event.description}</p>
        <div className="space-y-2 text-xs uppercase tracking-[0.24em] text-[#8A8478]">
          <p className="inline-flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            {event.venue}
          </p>
          <p className="inline-flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            {format(date, "EEE, do MMM · h:mm a")}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[#F5F0E8]">
            {typeof event.price === "number" ? `₹${event.price}` : "Free"}
          </span>
          {action}
        </div>
      </div>
    </GlassCard>
  );
}
