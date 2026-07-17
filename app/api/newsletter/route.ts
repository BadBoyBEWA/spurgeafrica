import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatZodIssues, newsletterSchema } from "@/lib/validation";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries()) as Record<string, string>;
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: formatZodIssues(parsed.error) }, { status: 400 });
    }

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsed.data.email },
    });

    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email: parsed.data.email,
      },
    });

    await sendEmail({
      to: parsed.data.email,
      subject: "Welcome to Spurge Africa",
      html: `<p>Thanks for subscribing to Spurge Africa. You’ll hear from us with new arrivals and tailoring updates.</p>`
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to subscribe." }, { status: 500 });
  }
}
