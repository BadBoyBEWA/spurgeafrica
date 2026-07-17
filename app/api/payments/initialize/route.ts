import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paymentInitializeSchema, formatZodIssues } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = paymentInitializeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: formatZodIssues(parsed.error) }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: parsed.data.orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    if (!secret) {
      return NextResponse.json({ error: "Paystack secret key not configured." }, { status: 500 });
    }

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data.email,
        amount: Math.round(parsed.data.amount * 100), // Paystack expects kobo
        reference: `SPG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message || "Failed to initialize payment" }, { status: 400 });
    }

    const reference = data.data.reference;
    
    await prisma.payment.create({
      data: {
        id: reference,
        orderId: parsed.data.orderId,
        reference,
        amount: parsed.data.amount,
        email: parsed.data.email,
        status: "initialized",
      },
    });

    return NextResponse.json({
      ok: true,
      authorizationUrl: data.data.authorization_url,
      reference,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to initialize payment." }, { status: 500 });
  }
}
