import type { PrismaClient } from "@prisma/client";

/** Canonical OCC clubs — kept in sync with `prisma/seed.ts` for production self-heal. */
export const OCC_DEFAULT_CLUBS = [
  {
    slug: "bikers",
    name: "Bikers",
    icon: "🏍",
    description: "Weekend rides, bike checks, mountain roads.",
    theme: "amber",
  },
  {
    slug: "music",
    name: "Music",
    icon: "🎵",
    description: "Open mics, studio sessions, collabs.",
    theme: "purple",
  },
  {
    slug: "sports",
    name: "Sports Football",
    icon: "⚽",
    description: "Tournaments, turf bookings, weekly matches.",
    theme: "green",
  },
  {
    slug: "photography",
    name: "Photography",
    icon: "📷",
    description: "Photo walks, exhibitions, paid shoots.",
    theme: "blue",
  },
  {
    slug: "fitness",
    name: "Fitness",
    icon: "💪",
    description: "Group workouts, nutrition, challenges.",
    theme: "charcoal",
  },
  {
    slug: "fashion",
    name: "Fashion",
    icon: "👗",
    description: "Showcases, brand deals, styling.",
    theme: "rose",
  },
] as const;

export async function ensureOccDefaultClubs(prisma: PrismaClient) {
  for (const club of OCC_DEFAULT_CLUBS) {
    await prisma.club.upsert({
      where: { slug: club.slug },
      update: {},
      create: { ...club },
    });
  }
}
