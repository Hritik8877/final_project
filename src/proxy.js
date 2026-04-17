import { NextResponse } from "next/server";

export default function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Define protected and public routes
  const isProtectedRoute = pathname.startsWith("/dashboard");
  const isPublicRoute = pathname === "/login" || pathname === "/register";

  // Check for session cookie (we'll set this on the client side upon login)
  const session = request.cookies.get("session")?.value;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
