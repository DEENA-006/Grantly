import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// SHIELD Protocol & CLEAR Authentication Gateway (Next.js 16 Proxy)
export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Block unauthorized administrative probes or hidden dotfiles
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.includes("/.env") ||
    pathname.includes("/.git")
  ) {
    return new NextResponse(
      JSON.stringify({ error: "Access Denied: Protected Route" }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Bypass Next.js static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static assets like images, icons, fonts
  ) {
    return NextResponse.next();
  }

  const isAuthCookie = request.cookies.get("grantly_authenticated")?.value === "true";

  // Explicit logout: clear the cookie and allow rendering /login
  if (pathname === "/login" && searchParams.has("logout")) {
    const response = NextResponse.next();
    response.cookies.delete("grantly_authenticated");
    addSecurityHeaders(response);
    return response;
  }

  // Next.js RSC client navigation / prefetch: do not hard-redirect so client doesn't get stuck in a loop
  const isRscRequest =
    request.headers.get("RSC") === "1" ||
    request.headers.get("Next-Router-Prefetch") === "1" ||
    request.headers.get("Next-Router-State-Tree") !== null;

  if (isRscRequest) {
    const response = NextResponse.next();
    addSecurityHeaders(response);
    return response;
  }

  // Full Document Request: If unauthenticated and accessing protected routes, redirect to /login
  if (!isAuthCookie && pathname !== "/login") {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  addSecurityHeaders(response);
  return response;
}

function addSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
