import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/product-queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = await searchProducts(q.trim());
  return NextResponse.json(results);
}
