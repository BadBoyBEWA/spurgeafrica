import { NextResponse } from "next/server";
import { apiMessages } from "@/lib/data";

export async function POST(request: Request) {
  const formData = await request.formData();
  apiMessages.push(Object.fromEntries(formData.entries()));
  return NextResponse.redirect(new URL("/contact?sent=1", request.url), 303);
}
