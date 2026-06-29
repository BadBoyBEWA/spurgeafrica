import { NextResponse } from "next/server";
import { apiOrders } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ orders: apiOrders });
}

export async function POST(request: Request) {
  const body = await request.json();
  apiOrders.push({ ...body, id: `SA-${Date.now()}`, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
