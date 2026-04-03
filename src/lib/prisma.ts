import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  __dbPingTimer?: ReturnType<typeof setInterval>;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Keep the DB connection warm — ping every 14 min to prevent idle disconnects.
// Safe: runs only once per process via the global guard.
if (!globalForPrisma.__dbPingTimer && typeof setInterval !== "undefined") {
  globalForPrisma.__dbPingTimer = setInterval(
    () => {
      prisma.$queryRaw`SELECT 1`.catch(() => {});
    },
    14 * 60 * 1000,
  );
}
