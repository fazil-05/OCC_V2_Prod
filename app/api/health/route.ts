import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const start = Date.now();

  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {}

  return NextResponse.json({
    status: "ok",
    uptime: process.uptime(),
    db: dbOk ? "connected" : "unreachable",
    latencyMs: Date.now() - start,
    timestamp: new Date().toISOString(),
  });
}
