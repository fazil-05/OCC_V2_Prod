"use client";

import * as React from "react";
import { ApplyGigButton } from "@/components/dashboard/ApplyGigButton";
import { EventCard } from "@/components/dashboard/EventCard";
import { FeedCard } from "@/components/dashboard/FeedCard";
import { GigCard } from "@/components/dashboard/GigCard";
import { RegisterEventButton } from "@/components/dashboard/RegisterEventButton";
import { cn } from "@/app/components/ui/utils";

const tabs = ["Feed", "Events", "Members", "Gigs"] as const;
type TabKey = (typeof tabs)[number];

type ClubTabsProps = {
  posts: Array<{
    id: string;
    imageUrl: string;
    caption?: string | null;
    likes: number;
    club: { name: string; icon: string };
    user: { fullName: string };
  }>;
  events: Array<{
    id: string;
    title: string;
    description: string;
    venue: string;
    date: Date | string;
    imageUrl?: string | null;
    club?: { name: string; icon: string } | null;
    price?: number;
    registered?: boolean;
  }>;
  members: Array<{
    id: string;
    fullName: string;
    collegeName: string;
    avatar?: string | null;
  }>;
  gigs: Array<{
    id: string;
    title: string;
    description: string;
    payMin: number;
    payMax: number;
    deadline?: Date | string | null;
    applied?: boolean;
  }>;
};

export function ClubTabs({ posts, events, members, gigs }: ClubTabsProps) {
  const [active, setActive] = React.useState<TabKey>("Feed");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 border-b border-white/8 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "pb-3 text-[12px] uppercase tracking-[0.3em] text-[#8A8478] transition",
              active === tab && "border-b border-[#C9A96E] text-[#F5F0E8]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === "Feed" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      {active === "Events" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              action={<RegisterEventButton eventId={event.id} registered={!!event.registered} />}
            />
          ))}
        </div>
      ) : null}

      {active === "Members" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const initials = member.fullName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase();
            return (
              <div key={member.id} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A96E]/15 text-sm text-[#C9A96E]">
                    {initials}
                  </div>
                  <div>
                    <p className="text-lg text-[#F5F0E8]">{member.fullName}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8A8478]">
                      {member.collegeName}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {active === "Gigs" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {gigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              action={<ApplyGigButton gigId={gig.id} applied={!!gig.applied} />}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
