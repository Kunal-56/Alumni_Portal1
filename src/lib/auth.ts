import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { query } from "@/lib/db";

const SESSION_COOKIE = "tolani_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionClaims = { userId: string; exp: number };
type CurrentUser = { id: string; email: string; role: string };

declare global {
  var _alumniPortalDevAuthSecret: string | undefined;
}

function getSessionSecret(): string | null {
  const configured = process.env.AUTH_SECRET;
  if (configured && Buffer.byteLength(configured) >= 32) return configured;
  if (process.env.NODE_ENV === "production") return null;

  // A process-local development key keeps local setup friction low. Restarting
  // the dev server invalidates these sessions; deployments must set AUTH_SECRET.
  global._alumniPortalDevAuthSecret ??= randomBytes(32).toString("base64url");
  return global._alumniPortalDevAuthSecret;
}

function sign(value: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(value).digest();
}

function encodeSession(userId: string): string | null {
  const secret = getSessionSecret();
  if (!secret) return null;
  const payload = Buffer.from(
    JSON.stringify({ userId, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })
  ).toString("base64url");
  return `${payload}.${sign(payload, secret).toString("base64url")}`;
}

function decodeSession(token?: string): SessionClaims | null {
  const secret = getSessionSecret();
  if (!secret || !token) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;

  try {
    const expected = sign(payload, secret);
    const actual = Buffer.from(signature, "base64url");
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionClaims;
    if (!claims.userId || !Number.isInteger(claims.exp) || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch {
    return null;
  }
}

export function createSessionCookie(userId: string): string | null {
  const token = encodeSession(userId);
  if (!token) return null;
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`;
}

export function clearSessionCookie(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export async function getAuthenticatedUser(request: NextRequest): Promise<CurrentUser | null> {
  const claims = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!claims) return null;

  const result = await query(
    "SELECT id, email, role FROM users WHERE id = $1 AND is_active = true LIMIT 1",
    [claims.userId]
  );
  return (result.rows[0] as CurrentUser | undefined) || null;
}

export async function isAuthorizedAdmin(request: NextRequest): Promise<boolean> {
  if (!hasSameOrigin(request)) return false;
  try {
    const user = await getAuthenticatedUser(request);
    return user?.role === "admin";
  } catch {
    return false;
  }
}

export async function isAuthenticatedSelf(request: NextRequest, email: string): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser(request);
    return Boolean(user && user.email.toLowerCase() === email.toLowerCase());
  } catch {
    return false;
  }
}

export function hasSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}
