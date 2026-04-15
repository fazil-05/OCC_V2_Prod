import { NextRequest, NextResponse } from "next/server";
import { getOAuthToken } from "@/lib/poll-store";

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get("key");

    if (!key) {
        return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }

    const result = getOAuthToken(key);

    if (!result) {
        // Not ready yet — app should keep polling
        return NextResponse.json({ status: "pending" }, { status: 202 });
    }

    if ("expired" in result) {
        return NextResponse.json({ error: "Session expired" }, { status: 410 });
    }

    // Success — return token
    return NextResponse.json({ token: result.token }, { status: 200 });
}