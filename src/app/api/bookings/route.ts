import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { createServerClient } from "@supabase/ssr";
import { stripe } from "@/lib/stripe";
import { sendEmail, bookingCancellationHtml } from "@/lib/email";
import { isWithinCancellationWindow } from "@/lib/cancellation";
import { PRICING } from "@/lib/constants";

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
  const { id, status, cancellationMessage } = body as {
    id?: string;
    status?: string;
    cancellationMessage?: string;
  };

  if (!id || status !== "cancelled") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const serviceClient = createServiceClient();

  // Load the booking
  const { data: booking, error: loadErr } = await serviceClient
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (loadErr || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.status !== "confirmed") {
    return NextResponse.json(
      { error: "Only confirmed bookings can be cancelled" },
      { status: 400 }
    );
  }

  // Grace period check
  if (!isWithinCancellationWindow(booking)) {
    return NextResponse.json(
      { error: "This session is outside the cancellation window" },
      { status: 400 }
    );
  }

  if (!booking.stripe_session_id) {
    return NextResponse.json(
      { error: "No payment record found — contact admin" },
      { status: 400 }
    );
  }

  // Retrieve Stripe session → payment_intent
  let paymentIntentId: string;
  try {
    const session = await stripe.checkout.sessions.retrieve(
      booking.stripe_session_id
    );
    const pi = session.payment_intent;
    if (!pi) {
      return NextResponse.json(
        { error: "No payment intent on Stripe session" },
        { status: 500 }
      );
    }
    paymentIntentId = typeof pi === "string" ? pi : pi.id;
  } catch (err) {
    console.error("Stripe session retrieve failed:", err);
    return NextResponse.json(
      { error: "Failed to look up payment. Booking not cancelled." },
      { status: 500 }
    );
  }

  // Issue refund
  let refundId: string;
  try {
    const refund = await stripe.refunds.create({ payment_intent: paymentIntentId });
    refundId = refund.id;
  } catch (err) {
    console.error("Stripe refund failed:", err);
    return NextResponse.json(
      { error: "Refund failed. Booking not cancelled." },
      { status: 500 }
    );
  }

  // Update booking row
  const trimmedMessage = cancellationMessage?.trim();
  const { data, error } = await serviceClient
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancellation_message: trimmedMessage && trimmedMessage.length > 0 ? trimmedMessage : null,
      refund_id: refundId,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("DB update after refund failed:", error, { refundId, bookingId: id });
    return NextResponse.json(
      { error: "Refund issued but DB update failed. Contact admin." },
      { status: 500 }
    );
  }

  // Send email (non-blocking for success — log and continue if it fails)
  try {
    const refundAmount = `$${PRICING[booking.duration_minutes] ?? 0}`;
    await sendEmail({
      to: booking.player_email,
      subject: `Your CT19 training on ${booking.date} was cancelled`,
      body: `Your training session on ${booking.date} at ${booking.start_time} has been cancelled. A refund of ${refundAmount} will appear in your account in 5–10 business days.`,
      html: bookingCancellationHtml({
        playerName: booking.player_name,
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time,
        duration: booking.duration_minutes,
        refundAmount,
        coachMessage: trimmedMessage || null,
      }),
      bcc: process.env.COACH_EMAIL,
    });
  } catch (err) {
    console.error("Cancellation email send failed:", err, { bookingId: id });
    // Intentionally do not fail the request — refund succeeded + DB updated.
  }

  return NextResponse.json(data);
}
