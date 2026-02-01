import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  let query = supabase
    .from("bookings")
    .select("*")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (date) {
    query = query.eq("date", date);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
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
  const { id, status } = body;

  if (!id || status !== "cancelled") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const serviceClient = createServiceClient();
  const { data, error } = await serviceClient
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
