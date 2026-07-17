import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tailoringSchema, formatZodIssues } from "@/lib/validation";
import { sendEmail } from "@/lib/email";
import { tailoringEnquiryTemplate } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = tailoringSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: formatZodIssues(parsed.error) }, { status: 400 });
    }

    const { measurements, ...restData } = parsed.data;
    
    const enquiry = await prisma.tailoringEnquiry.create({
      data: {
        ...restData,
        measurements: measurements ? JSON.stringify(measurements) : null,
      },
    });

    await sendEmail({
      to: parsed.data.email,
      subject: "Spurge Africa - Tailoring Enquiry Received",
      html: tailoringEnquiryTemplate(parsed.data.name),
    });

    await sendEmail({
      to: process.env.EMAIL_FROM ?? "hello@spurgeafrica.com",
      subject: "New tailoring enquiry from Spurge Africa",
      html: `<p>Name: ${parsed.data.name}</p><p>Email: ${parsed.data.email}</p><p>Phone: ${parsed.data.phone}</p><p>Notes: ${parsed.data.notes || "N/A"}</p>`
    });

    return NextResponse.json({ ok: true, enquiryId: enquiry.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to submit tailoring enquiry." }, { status: 500 });
  }
}
