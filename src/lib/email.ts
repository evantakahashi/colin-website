interface EmailParams {
  to: string;
  subject: string;
  body: string;
}

export function sendEmail({ to, subject, body }: EmailParams) {
  console.log("=== MOCK EMAIL ===");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  console.log("==================");
}
