import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createServerClient } from "@supabase/ssr";

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .order("weekday");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PUT(request: NextRequest) {
  // Verify coach auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const serviceClient = createServiceClient();

  // body is an array of AvailabilityRow
  for (const row of body) {
    const { error } = await serviceClient
      .from("availability")
      .update({ enabled: row.enabled, blocks: row.blocks })
      .eq("weekday", row.weekday);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
