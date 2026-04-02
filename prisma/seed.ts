import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const clubs = [
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
];

async function main() {
  const staffEmail = process.env.OCC_STAFF_ADMIN_EMAIL || "occ-staff-r8k2@occ-local.dev";
  const staffPassword = process.env.OCC_STAFF_ADMIN_PASSWORD || "Kx9#mQ2$vL8nW4pR@bF7tY1z";
  const adminHash = await bcrypt.hash(staffPassword, 12);
  await prisma.user.upsert({
    where: { email: staffEmail },
    update: {
      password: adminHash,
      role: "ADMIN",
      approvalStatus: "APPROVED",
    },
    create: {
      fullName: "OCC Staff",
      collegeName: "OCC HQ",
      phoneNumber: "0000000001",
      email: staffEmail,
      password: adminHash,
      role: "ADMIN",
      approvalStatus: "APPROVED",
    },
  });

  for (const club of clubs) {
    await prisma.club.upsert({
      where: { slug: club.slug },
      update: {},
      create: club,
    });
  }

  const clubMap = await prisma.club.findMany();
  const clubBySlug = Object.fromEntries(clubMap.map((club) => [club.slug, club]));

  if (clubBySlug.bikers) {
    await prisma.event.upsert({
      where: { id: "seed-bikers-dawn-ride" },
      update: {},
      create: {
        id: "seed-bikers-dawn-ride",
        clubId: clubBySlug.bikers.id,
        title: "Dawn Ride To Nandi",
        description: "Sunrise loop, breakfast stop, and route film drops.",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
        venue: "Hebbal Meet Point",
        price: 399,
        imageUrl:
          "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      },
    });
  }

  if (clubBySlug.photography) {
    await prisma.event.upsert({
      where: { id: "seed-photo-nightwalk" },
      update: {},
      create: {
        id: "seed-photo-nightwalk",
        clubId: clubBySlug.photography.id,
        title: "Night Walk Photo Jam",
        description: "Golden-hour portraits and low-light city frames.",
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 6),
        venue: "Church Street",
        price: 199,
        imageUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      },
    });
  }

  await prisma.gig.createMany({
    data: [
      {
        title: "Event Photography Reel Cut",
        description: "Edit a 30-second vertical reel from the latest club drop.",
        payMin: 2500,
        payMax: 4500,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
      },
      {
        title: "Weekend Ride Poster Pack",
        description: "Design social posters and ticket teasers for a city ride.",
        payMin: 1800,
        payMax: 3200,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
      },
    ],
    skipDuplicates: true,
  });

  console.log("Clubs seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
