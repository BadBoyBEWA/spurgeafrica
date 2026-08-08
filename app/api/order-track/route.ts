import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatZodIssues, orderTrackingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderTrackingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: formatZodIssues(parsed.error) },
        { status: 400 }
      );
    }

    const { orderId, email } = parsed.data;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        payments: true,
      },
    });

    if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ ok: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        customerName: order.customerName,
        email: order.email,
        phone: order.phone,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        address: order.address,
        city: order.city,
        state: order.state,
        country: order.country,
        postalCode: order.postalCode,
        deliveryMethod: order.deliveryMethod,
        paymentMethod: order.paymentMethod,
        payment: order.payments[0]
          ? {
              status: order.payments[0].status,
              reference: order.payments[0].reference,
              amount: order.payments[0].amount,
            }
          : null,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product?.name ?? item.productName ?? "Unknown product",
          quantity: item.quantity,
          price: item.price,
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Unable to retrieve order." }, { status: 500 });
  }
}
