"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

export function RegisterEventButton({
  eventId,
  registered,
}: {
  eventId: string;
  registered: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      type="button"
      disabled={registered || loading}
      className="rounded-full border border-[#C9A96E]/40 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#C9A96E] transition hover:bg-[#C9A96E]/10 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={async () => {
        setLoading(true);
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
        setLoading(false);
        if (response.ok) {
          router.refresh();
        }
      }}
    >
      {registered ? "Registered ✓" : loading ? "Registering..." : "Register →"}
    </button>
  );
}
