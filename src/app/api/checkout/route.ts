import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";
import { PRICING, TIMEZONE } from "@/lib/constants";
import { generateSlots, getWeekday } from "@/lib/slots";
import { AvailabilityRow, Booking } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { playerName, playerEmail, playerPhone, date, startTime, endTime, duration } = body;

    if (!playerName || !playerEmail || !playerPhone || !date || !startTime || !endTime || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const price = PRICING[duration];
    if (!price) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Get availability for this weekday
    const weekday = getWeekday(date);
    const { data: avail } = await supabase
      .from("availability")
      .select("*")
      .eq("weekday", weekday)
      .single();

    if (!avail || !avail.enabled) {
      return NextResponse.json({ error: "Day not available" }, { status: 400 });
    }

    // Get existing bookings for this date
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("*")
      .eq("date", date)
      .in("status", ["pending", "confirmed"]);

    // Validate the slot is still available
    const slots = generateSlots(
      avail as AvailabilityRow,
      (existingBookings || []) as Booking[],
      duration
    );
    const slotAvailable = slots.some((s) => s.start === startTime && s.end === endTime);

    if (!slotAvailable) {
      return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
    }

    // Insert pending booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        player_name: playerName,
        player_email: playerEmail,
        player_phone: playerPhone,
        date,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: duration,
        status: "pending",
      })
      .select()
      .single();

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Soccer Training - ${duration} min`,
              description: `${date} at ${startTime} (Pacific)`,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      customer_email: playerEmail,
      metadata: {
        booking_id: booking.id,
      },
    });

    // Update booking with stripe session ID
    await supabase
      .from("bookings")
      .update({ stripe_session_id: session.id })
      .eq("id", booking.id);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
