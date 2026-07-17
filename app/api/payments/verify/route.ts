import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentVerifySchema, formatZodIssues } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentVerifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: formatZodIssues(parsed.error) }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({
      where: { reference: parsed.data.reference },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found." }, { status: 404 });
    }

    if (payment.status === "verified") {
      return NextResponse.json({ ok: true, status: "verified", orderId: payment.orderId });
    }

    // Verify with Paystack API directly
    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    if (secret) {
      const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${parsed.data.reference}`, {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      });
      const paystackData = await paystackRes.json();
      
      if (paystackData.status && paystackData.data.status === "success") {
        await prisma.$transaction([
          prisma.payment.update({
            where: { reference: parsed.data.reference },
            data: { status: "verified" },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "confirmed" },
          }),
        ]);
        return NextResponse.json({ ok: true, status: "verified", orderId: payment.orderId });
      }
    }

    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to verify payment." }, { status: 500 });
  }
}
