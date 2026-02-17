import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ct19training.com";

interface EmailParams {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export async function sendEmail({ to, subject, body, html }: EmailParams) {
  await resend.emails.send({
    from: "CT19 Training <noreply@ct19training.com>",
    to,
    subject,
    text: body,
    ...(html && { html }),
  });
}

function to12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return m === 0 ? `${hour} ${period}` : `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export function bookingConfirmationHtml({
  playerName,
  date,
  startTime,
  endTime,
  duration,
  price,
  location,
}: {
  playerName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  price: string;
  location?: string;
}) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:24px;text-align:center;">
            <img src="${BASE_URL}/logo.png" alt="CT19 Training" width="120" style="display:block;margin:0 auto;" />
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px 28px;">
            <h1 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Session Confirmed!</h1>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;">Hi ${playerName}, your training session is booked.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr><td style="padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;width:110px;">Date</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${formatDate(date)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Time</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${to12h(startTime)} – ${to12h(endTime)} (Pacific)</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Duration</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${duration} minutes</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Paid</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${price}</td>
                  </tr>
                  ${location ? `<tr>
                    <td style="padding:6px 0;color:#64748b;font-size:14px;">Location</td>
                    <td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${location}</td>
                  </tr>` : ""}
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 4px;color:#64748b;font-size:13px;">Need to cancel or reschedule?</p>
            <p style="margin:0;color:#64748b;font-size:13px;">Call <a href="tel:+14084999643" style="color:#2563eb;">(408) 499-9643</a> or email <a href="mailto:colin19takahashi@gmail.com" style="color:#2563eb;">colin19takahashi@gmail.com</a></p>
          </td>
        </tr>
        <!-- Footer -->
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
