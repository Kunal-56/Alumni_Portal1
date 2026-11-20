import { createHash } from "node:crypto";
import { NextRequest } from "next/server";

type WindowEntry = { count: number; resetAt: number };
declare global {
  var _alumniPortalRateLimits: Map<string, WindowEntry> | undefined;
}

const store = (global._alumniPortalRateLimits ??= new Map());

function clientAddress(request: NextRequest): string {
  // These headers must be set/overwritten by the trusted reverse proxy in deployment.
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function checkRateLimit(
  request: NextRequest,
  action: string,
  limit: number,
  windowMs: number,
  identity = ""
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  if (store.size > 5000) {
    for (const [key, value] of store) if (value.resetAt <= now) store.delete(key);
    if (store.size > 5000) {
      const overflow = store.size - 4500;
      let removed = 0;
      for (const key of store.keys()) {
        store.delete(key);
        if (++removed >= overflow) break;
      }
    }
  }

  const address = clientAddress(request);
  const key = createHash("sha256").update(`${action}:${address}:${identity.toLowerCase()}`).digest("hex");
  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }
  if (entry.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
