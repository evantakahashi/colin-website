import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  // Delete cancelled bookings older than 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await supabase
    .from("bookings")
    .delete()
    .eq("status", "cancelled")
    .lt("created_at", oneDayAgo);

  // Delete stale pending bookings older than 15 minutes
  const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  await supabase
    .from("bookings")
    .delete()
    .eq("status", "pending")
    .lt("created_at", fifteenMinAgo);

  return NextResponse.json({ ok: true });
}
