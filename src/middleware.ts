import { NextResponse, type NextRequest } from "next/server";

function isStatic(pathname: string): boolean {
  return (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/_next/image") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/uploads/") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?|ttf|otf|json)$/i.test(pathname)
  );
}

function hasPathTraversal(pathname: string): boolean {
  return /(\.\.|%2e%2e|%252e%252e|%c0%af)/i.test(pathname);
}

function baselineHeaders(): Record<string, string> {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-DNS-Prefetch-Control": "off",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStatic(pathname)) {
    return NextResponse.next();
  }

  // Block path-traversal / encoded-dot-dot requests before they reach application code.
  if (hasPathTraversal(pathname)) {
    return new NextResponse("Invalid request path.", { status: 400 });
  }

  const response = NextResponse.next();
  for (const [key, value] of Object.entries(baselineHeaders())) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|woff2?|ttf|otf|json)$).*)",
};
