# Booking Cancellation with Refund + Client Notification — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a coach cancels a booking in the portal, issue a full Stripe refund, email the client (BCC coach) with an optional coach-provided message, and record cancellation metadata in the DB. Refund must succeed or the cancellation is aborted.

**Architecture:** Extend the existing `PATCH /api/bookings` handler to own the cancellation flow (auth → grace-period check → Stripe refund → DB update → email). Add a small modal to the coach portal to capture an optional message, and hide the cancel button for bookings whose session end is more than 7 days in the past. Store `cancelled_at`, `cancellation_message`, `refund_id` on the bookings row for audit.

**Tech Stack:** Next.js 16 App Router, Supabase (Postgres, service client), Stripe (Checkout + Refunds), Resend (email), Tailwind, Lucide icons.

**Spec:** `docs/superpowers/specs/2026-04-20-booking-cancellation-refund-design.md`

**Note on testing:** The project has no test framework (no jest/vitest/playwright in `package.json`). Rather than introducing one as part of this feature, each task ends with a manual verification step. Final task is a full manual smoke test.

---

## File Structure

- Modify: `src/lib/types.ts` — extend `Booking` interface with new columns
- Modify: `src/lib/email.ts` — add `bcc` param to `sendEmail`, add `bookingCancellationHtml` template
- Modify: `src/app/api/bookings/route.ts` — expand PATCH to do the full cancellation flow
- Modify: `src/components/coach/RecentBookings.tsx` — replace `confirm()` with modal, hide button past grace period
- Modify: `supabase-schema.sql` — update canonical schema with new columns
- Create: `migrations/2026-04-20-booking-cancellation.sql` — incremental ALTER migration to run in Supabase SQL Editor
- Create: `src/lib/cancellation.ts` — small helper module holding `GRACE_PERIOD_DAYS` constant and `isWithinCancellationWindow(booking, now)` predicate. Shared between PATCH handler and UI.

---

### Task 1: DB migration for cancellation columns

**Files:**
- Create: `migrations/2026-04-20-booking-cancellation.sql`
- Modify: `supabase-schema.sql`
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Create the migration SQL file**

Create `migrations/2026-04-20-booking-cancellation.sql`:

```sql
-- Run this in Supabase SQL Editor
-- Adds cancellation audit columns to bookings table.

alter table bookings
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_message text,
  add column if not exists refund_id text;
```

- [ ] **Step 2: Update the canonical schema file**

Modify `supabase-schema.sql` to reflect the new columns. Replace the `create table bookings (...)` block with:

```sql
-- Bookings table
create table bookings (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  player_email text not null,
  player_phone text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  duration_minutes int not null,
  status text not null default 'pending',
  stripe_session_id text,
  cancelled_at timestamptz,
  cancellation_message text,
  refund_id text,
  created_at timestamptz default now()
);
```

(Leave the `availability` table and seed rows untouched.)

- [ ] **Step 3: Update the Booking TypeScript interface**

Modify `src/lib/types.ts` — replace the `Booking` interface with:

```ts
export interface Booking {
  id: string;
  player_name: string;
  player_email: string;
  player_phone: string;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time: string; // HH:MM
  duration_minutes: number;
  location: string | null;
  status: "pending" | "confirmed" | "cancelled";
  stripe_session_id: string | null;
  cancelled_at: string | null;
  cancellation_message: string | null;
  refund_id: string | null;
  created_at: string;
}
```

- [ ] **Step 4: Apply migration in Supabase**

Run the SQL from `migrations/2026-04-20-booking-cancellation.sql` in the Supabase SQL Editor (Dashboard → SQL Editor → paste → Run).

Verify in the Table Editor that `bookings` now has `cancelled_at`, `cancellation_message`, and `refund_id` columns.

- [ ] **Step 5: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: no new errors. (Existing errors, if any, are unrelated.)

- [ ] **Step 6: Commit**

```bash
git add migrations/2026-04-20-booking-cancellation.sql supabase-schema.sql src/lib/types.ts
git commit -m "add cancellation columns to bookings"
```

---

### Task 2: Add cancellation window helper

**Files:**
- Create: `src/lib/cancellation.ts`

- [ ] **Step 1: Create the helper module**

Create `src/lib/cancellation.ts`:

```ts
import { Booking } from "@/lib/types";

export const GRACE_PERIOD_DAYS = 7;

export function sessionEndMs(booking: Pick<Booking, "date" | "end_time">): number {
  return new Date(`${booking.date}T${booking.end_time}:00`).getTime();
}

export function isWithinCancellationWindow(
  booking: Pick<Booking, "date" | "end_time">,
  now: Date = new Date()
): boolean {
  const graceMs = GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  return now.getTime() - sessionEndMs(booking) <= graceMs;
}
```

Note: `sessionEndMs` uses the browser/server local timezone. The app is already Pacific-only (see `src/lib/constants.ts`), so this is consistent with existing behavior elsewhere in the codebase. Do not add timezone handling unless you also change the rest of the date math.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/cancellation.ts
git commit -m "add cancellation window helper"
```

---

### Task 3: Extend sendEmail to accept BCC

**Files:**
- Modify: `src/lib/email.ts`

- [ ] **Step 1: Add bcc parameter to EmailParams and sendEmail**

In `src/lib/email.ts`, replace the `EmailParams` interface and `sendEmail` function with:

```ts
interface EmailParams {
  to: string;
  subject: string;
  body: string;
  html?: string;
  bcc?: string | string[];
}

export async function sendEmail({ to, subject, body, html, bcc }: EmailParams) {
  await resend.emails.send({
    from: "CT19 Training <noreply@ct19training.com>",
    to,
    subject,
    text: body,
    ...(html && { html }),
    ...(bcc && { bcc }),
  });
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/email.ts
git commit -m "support bcc in sendEmail"
```

---

### Task 4: Add cancellation email template

**Files:**
- Modify: `src/lib/email.ts`

- [ ] **Step 1: Append the cancellation HTML builder**

Append to the end of `src/lib/email.ts`:

```ts
export function bookingCancellationHtml({
  playerName,
  date,
  startTime,
  endTime,
  duration,
  refundAmount,
  coachMessage,
}: {
  playerName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  refundAmount: string;
  coachMessage?: string | null;
}) {
  const messageBlock = coachMessage && coachMessage.trim().length > 0
    ? `<div style="background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;padding:16px;margin:0 0 24px;">
        <p style="margin:0 0 6px;color:#78350f;font-size:13px;font-weight:600;">Message from your coach</p>
        <p style="margin:0;color:#78350f;font-size:14px;white-space:pre-wrap;">${escapeHtml(coachMessage)}</p>
      </div>`
    : `<p style="margin:0 0 24px;color:#64748b;font-size:15px;">Unfortunately we need to cancel this session.</p>`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr>
          <td style="background:#0f172a;padding:24px;text-align:center;">
            <img src="${BASE_URL}/logo.png" alt="CT19 Training" width="120" style="display:block;margin:0 auto;" />
          </td>
        </tr>
        <tr>
          <td style="padding:32px 28px;">
            <h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Session Cancelled</h1>
            <p style="margin:0 0 20px;color:#64748b;font-size:15px;">Hi ${escapeHtml(playerName)}, your training session has been cancelled.</p>
            ${messageBlock}
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr><td style="padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;width:140px;">Original date</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${formatDate(date)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Original time</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${to12h(startTime)} – ${to12h(endTime)} (Pacific)</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Duration</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${duration} minutes</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Refund</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${refundAmount}</td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 4px;color:#64748b;font-size:13px;">Your refund will appear in your account in 5–10 business days.</p>
            <p style="margin:0;color:#64748b;font-size:13px;">Questions? Call <a href="tel:+14084999643" style="color:#2563eb;">(408) 499-9643</a> or email <a href="mailto:colin19takahashi@gmail.com" style="color:#2563eb;">colin19takahashi@gmail.com</a></p>
          </td>
        </tr>
        <tr>
          <td style="background:#f8fafc;padding:16px 28px;text-align:center;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">CT19 Training — San Jose, CA</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
```

Note: `escapeHtml` is added because the coach's free-text message would otherwise allow HTML injection into the email. The existing `bookingConfirmationHtml` doesn't escape `playerName` — that's a latent issue, but fixing it is out of scope here.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/email.ts
git commit -m "add cancellation email template"
```

---

### Task 5: Expand PATCH /api/bookings to do full cancellation flow

**Files:**
- Modify: `src/app/api/bookings/route.ts`

- [ ] **Step 1: Replace the PATCH handler**

Replace the `PATCH` function in `src/app/api/bookings/route.ts` with:

```ts
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
```

- [ ] **Step 2: Add the new imports at the top of the file**

At the top of `src/app/api/bookings/route.ts`, add these imports alongside the existing ones:

```ts
import { stripe } from "@/lib/stripe";
import { sendEmail, bookingCancellationHtml } from "@/lib/email";
import { isWithinCancellationWindow } from "@/lib/cancellation";
import { PRICING } from "@/lib/constants";
```

- [ ] **Step 3: Add COACH_EMAIL to the env file**

Open `.env.local` and add:

```
COACH_EMAIL=colin19takahashi@gmail.com
```

(Use whatever address the coach wants BCC'd — matching the contact email in the confirmation template is a safe default.)

Also add to Vercel's environment variables via the dashboard (Production + Preview) before deploying.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Start the dev server for a smoke check**

Run: `npm run dev`
Open the coach portal, confirm the page still loads and bookings list still renders. Don't click cancel yet — full UI flow is built in Task 6.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/bookings/route.ts
git commit -m "PATCH /api/bookings: full cancel flow with refund + email"
```

Do NOT commit `.env.local` (already in `.gitignore`).

---

### Task 6: Coach portal UI — modal + hide past-grace button

**Files:**
- Modify: `src/components/coach/RecentBookings.tsx`

- [ ] **Step 1: Replace the component with the modal-enabled version**

Replace the entire contents of `src/components/coach/RecentBookings.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Booking } from "@/lib/types";
import { formatTimeDisplay } from "@/lib/slots";
import { isWithinCancellationWindow } from "@/lib/cancellation";
import { Calendar, XCircle } from "lucide-react";

export default function RecentBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelMessage, setCancelMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function fetchBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  function openCancelModal(b: Booking) {
    setCancelTarget(b);
    setCancelMessage("");
    setCancelError(null);
  }

  function closeCancelModal() {
    if (submitting) return;
    setCancelTarget(null);
    setCancelMessage("");
    setCancelError(null);
  }

  async function submitCancel() {
    if (!cancelTarget) return;
    setSubmitting(true);
    setCancelError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cancelTarget.id,
          status: "cancelled",
          cancellationMessage: cancelMessage,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Request failed" }));
        setCancelError(error || "Request failed");
        setSubmitting(false);
        return;
      }

      setCancelTarget(null);
      setCancelMessage("");
      setSubmitting(false);
      fetchBookings();
    } catch {
      setCancelError("Network error — try again");
      setSubmitting(false);
    }
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-400 border border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  if (loading) return <p className="text-slate-500">Loading bookings...</p>;

  const activeBookings = bookings.filter((b) => b.status === "confirmed");

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-slate-400" />
        Bookings
      </h3>

      {activeBookings.length === 0 ? (
        <p className="text-slate-500 text-sm">No bookings yet.</p>
      ) : (
        <div className="space-y-2">
          {activeBookings.map((b) => {
            const canCancel = isWithinCancellationWindow(b);
            return (
              <div
                key={b.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="text-sm">
                  <p className="font-medium text-white">{b.player_name}</p>
                  <p className="text-slate-400">
                    {b.date} · {formatTimeDisplay(b.start_time)} – {formatTimeDisplay(b.end_time)} · {b.duration_minutes}min
                  </p>
                  <p className="text-slate-500 text-xs">{b.player_email} · {b.player_phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                  {canCancel && (
                    <button
                      onClick={() => openCancelModal(b)}
                      className="text-red-400 hover:text-red-500 transition cursor-pointer"
                      title="Cancel booking"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelTarget && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={closeCancelModal}
        >
          <div
            className="bg-slate-900 border border-white/10 rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-white font-semibold text-lg mb-1">Cancel booking</h4>
            <p className="text-slate-400 text-sm mb-4">
              {cancelTarget.player_name} · {cancelTarget.date} at {formatTimeDisplay(cancelTarget.start_time)}
            </p>
            <p className="text-slate-400 text-sm mb-4">
              The client will be refunded and emailed automatically.
            </p>

            <label className="block text-slate-300 text-sm mb-1" htmlFor="cancel-msg">
              Message to client (optional)
            </label>
            <textarea
              id="cancel-msg"
              value={cancelMessage}
              onChange={(e) => setCancelMessage(e.target.value)}
              rows={4}
              placeholder="e.g. Field is closed due to weather."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-white/20"
              disabled={submitting}
            />

            {cancelError && (
              <p className="text-red-400 text-sm mt-3">{cancelError}</p>
            )}

            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={closeCancelModal}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-white/5 text-white text-sm hover:bg-white/10 transition disabled:opacity-50"
              >
                Keep booking
              </button>
              <button
                onClick={submitCancel}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition disabled:opacity-50"
              >
                {submitting ? "Cancelling..." : "Cancel booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Visual smoke check**

Run: `npm run dev`
Visit the coach portal, open the bookings list, click the red X on a confirmed booking.
Expected: modal appears with player's name, date, time, a textarea, and Keep/Cancel buttons. Click "Keep booking" — modal closes without action. (Do NOT submit yet — that triggers a real Stripe refund. Task 7 covers end-to-end testing.)

- [ ] **Step 4: Commit**

```bash
git add src/components/coach/RecentBookings.tsx
git commit -m "coach portal: cancel modal + hide past-grace bookings"
```

---

### Task 7: End-to-end manual verification

**Files:** none (testing task)

- [ ] **Step 1: Happy path — cancel with message**

1. In Stripe test mode, create a real booking through the public flow (complete checkout with `4242 4242 4242 4242`). Confirm it lands in the DB as `confirmed` with a `stripe_session_id`.
2. Log in to the coach portal, click the X on that booking, type a message (e.g., "Field closed due to rain"), click Cancel booking.
3. Verify:
   - Modal closes, booking disappears from the active list.
   - In the DB (Supabase Table Editor), the row has `status = 'cancelled'`, `cancelled_at` populated, `cancellation_message = 'Field closed due to rain'`, `refund_id` populated (starts with `re_`).
   - In the Stripe Dashboard, the original payment shows a full refund.
   - The client email address receives a cancellation email with the message visible in a highlighted block.
   - The `COACH_EMAIL` address receives the same email as BCC.

- [ ] **Step 2: Happy path — cancel without message**

Repeat Step 1, but leave the textarea empty.
Verify:
- `cancellation_message` is `NULL` in the DB (not an empty string).
- Email shows the generic fallback "Unfortunately we need to cancel this session." instead of the highlighted message block.

- [ ] **Step 3: Legacy row with null stripe_session_id**

In the Supabase SQL Editor, insert or update a test row:

```sql
update bookings set stripe_session_id = null where id = '<some-confirmed-booking-id>';
```

Attempt to cancel it in the coach portal.
Expected: error toast reads "No payment record found — contact admin". Booking row is unchanged (`status` still `confirmed`, `refund_id` still `NULL`).

Undo after testing:

```sql
update bookings set stripe_session_id = '<original-value>' where id = '<id>';
```

- [ ] **Step 4: Refund failure → booking unchanged**

Simulate a refund failure. Easiest way: in the Supabase SQL Editor, set `stripe_session_id` to an invalid string like `'cs_test_invalid_xxxxx'` on a test booking, then try to cancel.

Expected: coach sees "Failed to look up payment. Booking not cancelled." Booking row is unchanged.

Restore the real session ID afterwards.

- [ ] **Step 5: Grace period**

In the DB, manually set a confirmed test booking's `date` and `end_time` to more than 7 days ago:

```sql
update bookings set date = current_date - interval '10 days', end_time = '10:00' where id = '<id>';
```

Reload the coach portal. The X cancel button should be hidden for that booking.

Try calling the PATCH endpoint directly anyway (via browser devtools or curl with the auth cookie):

```bash
curl -X PATCH https://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Cookie: <your-auth-cookie>" \
  -d '{"id":"<id>","status":"cancelled"}'
```

Expected: `400 {"error":"This session is outside the cancellation window"}`.

Restore the booking's date afterwards.

- [ ] **Step 6: Inside-window but past-dated**

Set a booking's date to yesterday. The cancel button should still show (we're inside the 7-day window). Cancel successfully — confirms that past-but-recent bookings work.

- [ ] **Step 7: Commit any small fixes found during testing**

If you had to tweak anything during the above, commit it. Otherwise skip.

---

## Deployment checklist

- [ ] `COACH_EMAIL` env var set in Vercel (Production and Preview environments).
- [ ] DB migration applied to the production Supabase project (via SQL Editor against the prod project, not just local/dev).
- [ ] Verified Stripe **live** mode still works end-to-end after deploy (cancel a $0 test booking if you have one, or do a small real test + refund).
