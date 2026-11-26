import { randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const CSRF_COOKIE = "tolani_csrf";
export const CSRF_HEADER = "x-csrf-token";
export const CSRF_TTL_SECONDS = 60 * 60 * 8;

/** Generates a cryptographically random CSRF token. */
export function generateCsrfToken(): string {
  return randomBytes(16).toString("base64url");
}

/** Attaches the CSRF token as an HttpOnly SameSite cookie on the response. */
export function setCsrfCookie(response: NextResponse, token: string): void {
  response.headers.append(
    "Set-Cookie",
    `${CSRF_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CSRF_TTL_SECONDS}`
  );
}

/** Reads the CSRF token from the cookie and the custom header and compares them in constant time. */
export function validateCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);
  if (!cookieToken || !headerToken || cookieToken.length !== headerToken.length) return false;
  return timingSafeEqual(Buffer.from(cookieToken, "utf8"), Buffer.from(headerToken, "utf8"));
}

/** Returns a 403 response when the CSRF token is missing or invalid; null when valid. */
export function requireCsrf(request: NextRequest): NextResponse | null {
  if (!validateCsrfToken(request)) {
    return NextResponse.json({ success: false, error: "CSRF token missing or invalid." }, { status: 403 });
  }
  return null;
}
