import { test, expect } from "@playwright/test";

const api = (path: string) => path;

test.describe("Alumni Portal - API functional checks (read-only/validation)", () => {
  test("FT-API-001 Health endpoint reports database health", async ({ request }) => {
    const response = await request.get(api("/api/health"));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("status", "healthy");
  });

  test("FT-API-002 Login rejects missing email", async ({ request }) => {
    const response = await request.post(api("/api/auth/login"), { data: { password: "not-a-real-password" } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/email is required/i);
  });

  test("FT-API-003 Login rejects missing password", async ({ request }) => {
    const response = await request.post(api("/api/auth/login"), { data: { email: "qa.invalid@example.test" } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/password is required/i);
  });

  test("FT-API-004 Registration rejects invalid email before database write", async ({ request }) => {
    const response = await request.post(api("/api/auth/register"), {
      data: { fullName: "QA Validation", email: "invalid-email", password: "ValidPass123" }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/valid email/i);
  });

  test("FT-API-005 Registration rejects password shorter than ten characters", async ({ request }) => {
    const response = await request.post(api("/api/auth/register"), {
      data: { fullName: "QA Validation", email: "qa.invalid@example.test", password: "123" }
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/at least 10 characters/i);
  });

  test("FT-API-006 Current-user endpoint requires an authenticated session", async ({ request }) => {
    const response = await request.get(api("/api/auth/me"));
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/authentication required/i);
  });

  test("FT-API-007 Alumni list endpoint returns a structured response", async ({ request }) => {
    const response = await request.get(api("/api/alumni?limit=5&page=1"));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("alumni");
    expect(Array.isArray(body.alumni)).toBe(true);
    expect(body).toHaveProperty("pagination");
  });

  test("FT-API-008 Events list endpoint returns a structured response", async ({ request }) => {
    const response = await request.get(api("/api/events"));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("events");
    expect(Array.isArray(body.events)).toBe(true);
  });

  test("FT-API-009 News list endpoint returns a structured response", async ({ request }) => {
    const response = await request.get(api("/api/news"));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("news");
    expect(Array.isArray(body.news)).toBe(true);
  });

  test("FT-API-010 Gallery list endpoint returns a structured response", async ({ request }) => {
    const response = await request.get(api("/api/gallery"));
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
  });

  test("FT-API-011 Unknown department is reported as not found", async ({ request }) => {
    const response = await request.get(api("/api/departments/qa-unknown-department"));
    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(body.success).toBe(false);
  });

  test("FT-API-012 Department alumni endpoint returns a structured response", async ({ request }) => {
    const response = await request.get(api("/api/departments/computer/alumni?limit=5&page=1"));
    expect(response.status()).toBe(200);
    {
      const body = await response.json();
      expect(body).toHaveProperty("success", true);
      expect(body).toHaveProperty("alumni");
      expect(Array.isArray(body.alumni)).toBe(true);
    }
  });

  test("FT-API-013 Upload endpoint rejects unauthenticated callers", async ({ request }) => {
    const response = await request.post(api("/api/upload"), { multipart: { folder: "events" } });
    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.success).toBe(false);
  });
});
