"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export function JoinClubButton({
  slug,
  joined,
}: {
  slug: string;
  joined: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      type="button"
      disabled={joined || loading}
      className={`rounded-full px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.2em] transition shadow-lg ${
        joined
          ? "bg-slate-100 text-slate-500 shadow-none border border-slate-200 cursor-default"
          : "bg-[#5227FF] text-white hover:bg-[#431ce3] hover:shadow-[#5227FF]/25 hover:-translate-y-0.5"
      } disabled:opacity-60 disabled:pointer-events-none`}
      onClick={async () => {
        setLoading(true);
        const response = await fetch(`/api/clubs/${slug}/join`, { method: "POST" });
        setLoading(false);
        if (response.ok) {
          router.refresh();
        }
      }}
    >
      {joined ? "Member ✓" : loading ? "Joining..." : "Join Club →"}
    </button>
  );
}
