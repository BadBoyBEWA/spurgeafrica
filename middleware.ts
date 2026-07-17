import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/orders/:path*",
    "/admin/products/:path*",
    "/admin/messages/:path*",
    "/admin/subscribers/:path*",
    "/admin/tailoring/:path*",
    "/api/admin/:path*"
  ],
};
