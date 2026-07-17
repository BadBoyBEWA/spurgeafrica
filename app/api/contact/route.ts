import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema, formatZodIssues } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { contactMessageTemplate } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Record<string, string>;
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: formatZodIssues(parsed.error) }, { status: 400 });
    }

    const message = await prisma.contactMessage.create({
      data: parsed.data,
    });

    await sendEmail({
      to: parsed.data.email,
      subject: "Spurge Africa - Message Received",
      html: contactMessageTemplate(parsed.data.name),
    });

    await sendEmail({
      to: process.env.EMAIL_FROM ?? "hello@spurgeafrica.com",
      subject: "New contact message from Spurge Africa",
      html: `<p>Name: ${parsed.data.name}</p><p>Email: ${parsed.data.email}</p><p>Phone: ${parsed.data.phone || "N/A"}</p><p>Message: ${parsed.data.message}</p>`,
      replyTo: parsed.data.email
    });

    return NextResponse.json({ ok: true, message: "Message received." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to send message." }, { status: 500 });
  }
}
