"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export function ApplyGigButton({
  gigId,
  applied,
}: {
  gigId: string;
  applied: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      type="button"
      disabled={applied || loading}
      className="w-full rounded-md border border-[#C9A96E]/40 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-[#C9A96E] transition hover:bg-[#C9A96E]/10 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={async () => {
        setLoading(true);
        const response = await fetch("/api/gigs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gigId }),
        });
        setLoading(false);
        if (response.ok) {
          router.refresh();
        }
      }}
    >
      {applied ? "Applied ✓" : loading ? "Applying..." : "Apply Now"}
    </button>
  );
}
