import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import { sendEmail, bookingConfirmationHtml } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata?.booking_id;

    if (bookingId) {
      const supabase = createServiceClient();

      const { data: booking } = await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", bookingId)
        .select()
        .single();

      if (booking) {
        const price = booking.duration_minutes === 60 ? "$50" : "$75";
        const html = bookingConfirmationHtml({
          playerName: booking.player_name,
          date: booking.date,
          startTime: booking.start_time,
          endTime: booking.end_time,
          duration: booking.duration_minutes,
          price,
          location: booking.location || undefined,
        });
        await sendEmail({
          to: booking.player_email,
          subject: "Your CT19 Training Session is Confirmed!",
          body: `Hi ${booking.player_name}, your ${booking.duration_minutes}-min session on ${booking.date} at ${booking.start_time} is confirmed.`,
          html,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
