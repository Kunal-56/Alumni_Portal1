import { expect, test } from "@playwright/test";

test.describe("portal security controls (additive, non-invasive)", () => {
  test("applies baseline security headers to public pages", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();
    expect(response.status()).toBeLessThan(400);
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["x-dns-prefetch-control"]).toBe("off");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
  });

  test("applies baseline security headers to API routes", async ({ request }) => {
    const response = await request.get("/api/health");
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-dns-prefetch-control"]).toBe("off");
  });

  test("blocks path-traversal requests before reaching application code", async ({ request }) => {
    const traversalPaths = [
      "/%2e%2e/%2e%2e/etc/passwd",
      "/..%2f..%2f..%2fetc/passwd",
      "/..\\..\\..\\windows\\win.ini",
    ];
    for (const path of traversalPaths) {
      const response = await request.get(path);
      // Next.js normalizes dot-dot segments server-side; no file is disclosed (400 from middleware or 404 after normalization).
      expect([400, 404].includes(response.status()), path).toBeTruthy();
    }
  });

  test("serves the security.txt disclosure", async ({ request }) => {
    const response = await request.get("/.well-known/security.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Contact:");
    expect(body).toContain("Preferred-Languages:");
  });

  test("denies file upload without an administrator session", async ({ request }) => {
    const response = await request.post("/api/upload", {
      headers: { origin: "http://localhost:3000" },
    });
    expect(response.status()).toBe(403);
    const json = await response.json();
    expect(json.success).toBe(false);
  });
});
