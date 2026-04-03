"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type AdminGigRow = {
  id: string;
  title: string;
  description: string;
  payMin: number;
  payMax: number;
  createdAt: string;
  club: { id: string; name: string; slug: string } | null;
  postedBy: { id: string; fullName: string; email: string } | null;
  applications: {
    id: string;
    status: string;
    message: string | null;
    createdAt: string;
    user: { id: string; fullName: string; email: string; phoneNumber: string };
  }[];
};

export function AdminGigsClient({ gigs }: { gigs: AdminGigRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const stats = useMemo(() => {
    let apps = 0;
    let pending = 0;
    for (const g of gigs) {
      for (const a of g.applications) {
        apps += 1;
        if (a.status === "PENDING") pending += 1;
      }
    }
    return { apps, pending, gigs: gigs.length };
  }, [gigs]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8C6DFD]">Operations</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Gigs &amp; hires</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/45">
          Full visibility into club-posted gigs, applicants, and outcomes. Events also generate staff notifications.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-white/35">Gigs</p>
            <p className="text-xl font-semibold text-white">{stats.gigs}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-white/35">Applications</p>
            <p className="text-xl font-semibold text-white">{stats.apps}</p>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-white/35">Awaiting header</p>
            <p className="text-xl font-semibold text-amber-200/90">{stats.pending}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {gigs.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.08] py-16 text-center text-sm text-white/35">
            No gigs in the system yet.
          </div>
        ) : (
          gigs.map((gig) => {
            const open = openId === gig.id;
            return (
              <div
                key={gig.id}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : gig.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/[0.04]"
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold text-white">{gig.title}</p>
                    <p className="mt-1 text-xs text-white/40">
                      {gig.club?.name ?? "—"} · {gig.postedBy?.fullName ?? "—"} ·{" "}
                      {format(new Date(gig.createdAt), "dd MMM yyyy HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/35">{gig.applications.length} apps</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-white/30 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-white/[0.06]"
                    >
                      <p className="px-5 py-3 text-[13px] leading-relaxed text-white/45">{gig.description}</p>
                      <p className="px-5 pb-2 text-xs text-emerald-200/80">
                        ₹{gig.payMin.toLocaleString("en-IN")} – ₹{gig.payMax.toLocaleString("en-IN")}
                      </p>
                      <div className="space-y-2 px-3 pb-4">
                        {gig.applications.map((a) => (
                          <div
                            key={a.id}
                            className="rounded-xl border border-white/[0.06] bg-black/25 px-4 py-3 text-[13px]"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-medium text-white">{a.user.fullName}</span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                  a.status === "APPROVED"
                                    ? "bg-emerald-500/20 text-emerald-200"
                                    : a.status === "REJECTED"
                                      ? "bg-red-500/20 text-red-200"
                                      : "bg-amber-500/20 text-amber-100"
                                }`}
                              >
                                {a.status}
                              </span>
                            </div>
                            <p className="mt-1 text-[11px] text-white/35">{a.user.email}</p>
                            <p className="text-[11px] text-white/35">{a.user.phoneNumber}</p>
                            {a.message ? (
                              <p className="mt-2 border-t border-white/[0.06] pt-2 text-white/50">{a.message}</p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
