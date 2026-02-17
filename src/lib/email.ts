import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: EmailParams) {
  await resend.emails.send({
    from: "CT19 Training <noreply@ct19training.com>",
    to,
    subject,
    text: body,
  });
}
