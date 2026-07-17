import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, text, replyTo }: SendEmailOptions) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.info(`[email] SMTP not configured. Skipping email to ${to}`);
    return { ok: true, skipped: true };
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user,
      pass
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM ?? user,
    to,
    replyTo,
    subject,
    text,
    html
  });

  return { ok: true, skipped: false };
}
