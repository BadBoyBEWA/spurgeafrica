import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY || "";
    const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);

    if (body.event === "charge.success") {
      const reference = body.data.reference;

      const payment = await prisma.payment.findUnique({
        where: { reference },
      });

      if (payment && payment.status !== "verified") {
        await prisma.$transaction([
          prisma.payment.update({
            where: { reference },
            data: { status: "verified" },
          }),
          prisma.order.update({
            where: { id: payment.orderId },
            data: { status: "confirmed" },
          }),
        ]);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
