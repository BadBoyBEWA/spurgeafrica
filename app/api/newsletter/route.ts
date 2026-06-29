import { NextResponse } from "next/server";
import { apiSubscribers } from "@/lib/data";

export async function POST(request: Request) {
  const formData = await request.formData();
  apiSubscribers.push({ email: formData.get("email"), createdAt: new Date().toISOString() });
  return NextResponse.redirect(new URL("/?subscribed=1", request.url), 303);
}
