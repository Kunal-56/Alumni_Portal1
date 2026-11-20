import { expect, test } from "@playwright/test";

test("rejects client supplied identity and role claims", async ({ request }) => {
  const forgedHeaders: Record<string, string>[] = [
    { "x-user-email": "admin@tolani.ac.in", "x-role": "admin", "x-admin-auth": "true" },
    { cookie: "tolani_session=attacker; tolani_admin=true; role=admin" },
    { cookie: "tolani_session=not-a-valid-signed-session" },
    { authorization: "Bearer attacker-controlled" },
  ];
  for (const headers of forgedHeaders) {
    const response = await request.get("/api/auth/me?email=admin%40tolani.ac.in", { headers });
    expect(response.status()).toBe(401);
  }

  const tamperedSession = await request.get("/api/auth/me", {
    headers: { cookie: "tolani_session=eyJlbWFpbCI6ImFkbWluQHRvbGFuaS5hYy5pbiIsInJvbGUiOiJhZG1pbiJ9.invalid" },
  });
  expect(tamperedSession.status()).toBe(401);

  const crossOrigin = await request.post("/api/events", {
    headers: { origin: "https://attacker.example", "x-role": "admin" },
    data: {},
  });
  expect(crossOrigin.status()).toBe(403);
});

test("admin content creation endpoints reject forged headers and bearer tokens", async ({ request }) => {
  const cases = [
    { url: "/api/events", method: "post" as const },
    { url: "/api/news", method: "post" as const },
    { url: "/api/gallery", method: "post" as const },
    { url: "/api/upload", method: "post" as const },
    { url: "/api/events/1", method: "put" as const },
    { url: "/api/events/1", method: "delete" as const },
    { url: "/api/gallery/1", method: "put" as const },
    { url: "/api/gallery/1", method: "delete" as const },
    { url: "/api/news/1", method: "put" as const },
    { url: "/api/news/1", method: "delete" as const },
    { url: "/api/alumni/1", method: "patch" as const },
    { url: "/api/alumni/1", method: "delete" as const },
  ];

  for (const [index, item] of cases.entries()) {
    const headers: Record<string, string> = index % 4 === 0
      ? { "x-role": "admin" }
      : index % 4 === 1
        ? { "x-admin-auth": "true" }
        : index % 4 === 2
          ? { authorization: "Bearer attacker-controlled" }
          : { cookie: "tolani_admin=true; role=admin" };
    const response = await request[item.method](item.url, { headers, data: {} });
    expect(response.status(), `${item.method.toUpperCase()} ${item.url}`).toBe(403);
  }
});

test("logout expires the HttpOnly session cookie", async ({ request }) => {
  const response = await request.post("/api/auth/logout");
  expect(response.ok()).toBeTruthy();
  const setCookie = response.headers()["set-cookie"] || "";
  expect(setCookie).toContain("HttpOnly");
  expect(setCookie).toContain("Max-Age=0");
});

test("responses include the configured security headers", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'self'");
});
