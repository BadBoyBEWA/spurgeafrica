import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { formatZodIssues, orderSchema } from "@/lib/validation";

export async function GET() {
  const orders = await prisma.order.findMany();
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: formatZodIssues(parsed.error) }, { status: 400 });
    }

    const { items, ...orderData } = parsed.data;
    const orderId = `SA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const order = await prisma.order.create({
      data: {
        id: orderId,
        ...orderData,
        status: "pending",
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
    });

    return NextResponse.json({ ok: true, orderId: order.id, order });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to create order." }, { status: 500 });
  }
}
