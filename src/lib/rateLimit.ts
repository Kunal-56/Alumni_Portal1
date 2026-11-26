import { createHash } from "node:crypto";
import { NextRequest } from "next/server";

declare global {
  var _alumniPortalSlidingLimits: Map<string, number[]> | undefined;
}

const store: Map<string, number[]> = (global._alumniPortalSlidingLimits ??= new Map<string, number[]>());

function clientAddress(request: NextRequest): string {
  // These headers must be set/overwritten by the trusted reverse proxy in deployment.
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export function checkRateLimit(
  request: NextRequest,
  action: string,
  limit: number,
  windowMs: number,
  identity = "",
  dimension: "ip" | "account" = "ip"
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  if (store.size > 5000) {
    for (const [key, hits] of store) {
      if (!hits.some((timestamp: number) => now - timestamp < windowMs)) store.delete(key);
    }
    if (store.size > 5000) {
      const overflow = store.size - 4500;
      let removed = 0;
      for (const key of store.keys()) {
        store.delete(key);
        if (++removed >= overflow) break;
      }
    }
  }

  const subject = dimension === "account"
    ? identity.toLowerCase()
    : clientAddress(request);
  const key = createHash("sha256").update(`${action}:${dimension}:${subject}`).digest("hex");
  const hits = (store.get(key) ?? []).filter((timestamp: number) => now - timestamp < windowMs);
  if (hits.length >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
    store.set(key, hits);
    return { allowed: false, retryAfterSeconds };
  }
  hits.push(now);
  store.set(key, hits);
  return { allowed: true, retryAfterSeconds: 0 };
}
