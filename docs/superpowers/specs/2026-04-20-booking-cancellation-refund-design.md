# Booking Cancellation with Refund + Client Notification

## Problem

Cancelling a booking in the coach portal currently only flips `status` to `"cancelled"` in the DB. The client is not notified and is not refunded. This requires the coach to manually refund through Stripe and email the client separately — error-prone and easy to forget.

## Goal

When the coach cancels a booking in the portal:
1. Optionally capture a cancellation message from the coach.
2. Issue a full Stripe refund for the original payment.
3. Email the client with the cancellation details, the coach's message (if provided), and refund info.
4. Mark the booking cancelled in the DB with an audit trail.

Refund must succeed for the cancellation to go through. If the refund fails, nothing else happens — the booking stays `confirmed` and the coach sees the error.

## Non-Goals

- Partial refunds, cancellation fees, late-cancel policies.
- Rescheduling flow.
- Client-initiated cancellation.
- Background/async refund processing.

## Architecture

Extend the existing `PATCH /api/bookings` handler. The endpoint becomes the single owner of the cancel-booking operation: it refunds via Stripe, updates the DB row, and sends the email. If any step that must succeed fails, the whole operation aborts and returns an error to the client.

### Flow

```
Coach clicks X on booking
  → Modal opens with optional message textarea
  → Coach clicks Confirm
  → PATCH /api/bookings { id, status: "cancelled", cancellationMessage? }
      → Auth check (existing)
      → Load booking, verify status === "confirmed" and stripe_session_id is set
      → Verify session end datetime is within 7 days of now (grace period)
      → stripe.checkout.sessions.retrieve(stripe_session_id) → payment_intent
      → stripe.refunds.create({ payment_intent }) → refund.id
      → UPDATE bookings SET status, cancelled_at, cancellation_message, refund_id
      → sendEmail(client, cancellationHtml)
      → 200 OK
  → UI refreshes booking list
```

### Error handling

| Condition | Behavior |
|---|---|
| Booking not found / wrong status | 404 / 400, no changes |
| Session ended more than 7 days ago (grace period expired) | 400 "This session is outside the cancellation window", no changes |
| `stripe_session_id` is null (legacy row) | 400 "No payment record found — contact admin", no changes |
| Stripe session retrieval fails | 500, no changes, coach sees error |
| Stripe refund fails | 500, no changes, coach sees error |
| Email send fails | Log, but still return 200. Refund + DB update already succeeded — don't rollback a successful refund because of an email delivery failure. Surface this in logs for follow-up. |

## Components

### DB migration

Add three columns to `bookings`:

- `cancelled_at timestamptz` — when the cancellation was processed
- `cancellation_message text` — the coach's message, `NULL` when coach skipped the textarea
- `refund_id text` — Stripe refund ID, for audit. Nullable to accommodate legacy pre-migration rows; set for every new cancellation going forward

### `src/app/api/bookings/route.ts` (PATCH)

Expanded to do the full cancellation flow. Input: `{ id: string, status: "cancelled", cancellationMessage?: string }`. Output: updated booking row on success.

### `src/lib/email.ts`

Extend `sendEmail` params to accept an optional `bcc?: string | string[]`. Add `bookingCancellationHtml({ playerName, date, startTime, endTime, duration, refundAmount, coachMessage? })` following the same template pattern as `bookingConfirmationHtml`. The cancellation send path passes `bcc: process.env.COACH_EMAIL`. Email includes:

- Subject: `Your CT19 training on [date] was cancelled`
- Original session details (date, time, duration)
- Coach's message if provided, otherwise a generic "Unfortunately we need to cancel this session" line
- Refund amount + "This will appear in your account in 5–10 business days"
- Contact info

### `src/components/coach/RecentBookings.tsx`

Replace the `confirm()` call with a small modal:

- Textarea labeled "Message to client (optional)"
- "Cancel booking" / "Keep booking" buttons
- Show a loading state while the PATCH is in flight (refund + email take a moment)
- Show an error toast/inline message if the request fails
- On success, refresh the list

Hide the X cancel button for any booking whose session end is more than 7 days in the past. Server-side check in the PATCH handler is still the source of truth — the UI hide is purely cosmetic.

## Data flow

1. Modal submits `{ id, cancellationMessage }` to PATCH handler.
2. Handler reads booking from DB, derives `payment_intent` from `stripe_session_id`, issues refund, updates row, sends email.
3. Booking row's `cancellation_message` stores exactly what the coach typed, or `NULL` if they left the textarea empty. Whitespace-only input is treated as empty.
4. Email template branches on whether `coachMessage` was provided (non-null, non-empty).

## Testing

- Manual: full happy path (confirmed booking → cancel with message → client gets email → Stripe dashboard shows refund → booking row has all three new columns populated).
- Manual: skip message path.
- Manual: legacy booking with null `stripe_session_id` → coach sees block.
- Manual: booking with session end > 7 days ago → cancel button hidden; direct PATCH returns 400.
- Manual: booking with session end < 7 days ago but already passed → cancel still works (inside grace window).
- Manual: trigger refund failure (use Stripe test card that errors on refund, or manually invalidate session) → verify booking stays confirmed.
- Manual: confirm coach receives BCC of cancellation email.

## Security / Auth

No changes. Existing cookie-based coach auth on the PATCH endpoint is sufficient. Service client continues to be used for the DB write.

## Config

New env var: `COACH_EMAIL` — BCC recipient for cancellation emails. Must be set before this feature ships.
