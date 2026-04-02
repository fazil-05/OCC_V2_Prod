import { format } from "date-fns";
import { GlassCard } from "@/components/ui/GlassCard";

export function GigCard({
  gig,
  action,
}: {
  gig: {
    id: string;
    title: string;
    description: string;
    payMin: number;
    payMax: number;
    deadline?: Date | string | null;
  };
  action?: React.ReactNode;
}) {
  const deadline = gig.deadline ? new Date(gig.deadline) : null;

  return (
    <GlassCard className="rounded-[24px] p-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A96E]">Gig Opportunity</p>
          <h3 className="font-headline text-2xl text-[#F5F0E8]">{gig.title}</h3>
          <p className="text-sm leading-6 text-[#A9A294]">{gig.description}</p>
        </div>
        <div className="space-y-1">
          <p className="text-lg text-[#C9A96E]">₹{gig.payMin.toLocaleString()} - ₹{gig.payMax.toLocaleString()}</p>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8A8478]">
            {deadline ? `Deadline · ${format(deadline, "dd MMM yyyy")}` : "Open application"}
          </p>
        </div>
        {action}
      </div>
    </GlassCard>
  );
}
