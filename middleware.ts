import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check for user authentication only on protected routes
  if (path.startsWith("/my-trips")) {
    // Parse and validate user cookie
    const user = (() => {
      try {
        const userCookie = request.cookies.get("user");
        if (!userCookie?.value) return null;
        return JSON.parse(decodeURIComponent(userCookie.value));
      } catch (e) {
        console.error("Error parsing user cookie:", e);
        return null;
      }
    })();

    if (!user) {
      // If not authenticated and trying to access my-trips, redirect to home
      const baseUrl = request.nextUrl.origin;
      const response = NextResponse.redirect(`${baseUrl}/`);

      // Add cache control headers to prevent caching of the redirect
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");

      return response;
    }

    // Add auth headers for RSC requests
    const response = NextResponse.next();
    response.headers.set("x-middleware-cache", "no-cache");
    return response;
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/my-trips/:path*"],
};
