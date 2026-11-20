import { expect, test } from "@playwright/test";
import { sanitizeIndianMobileInput, sanitizeNameInput, validateAlumniName, validateFullName, validateIndianMobile } from "../../src/lib/inputValidation";

function sameOriginHeader(baseURL: string | undefined): string {
  if (!baseURL) throw new Error("Playwright baseURL must be configured for API validation tests.");
  const origin = new URL(baseURL);
  if (origin.hostname === "127.0.0.1") origin.hostname = "localhost";
  return origin.origin;
}

test.describe("name and mobile validation helpers", () => {
  test("accepts alumni names from 10 to 15 characters and rejects names outside that range", () => {
    expect(validateAlumniName("A")).toMatch(/between 10 and 15 characters/i);
    expect(validateAlumniName("Asha Patel")).toBeNull();
    expect(validateAlumniName("Alexandra Patel")).toBeNull();
    expect(validateAlumniName("Alexandra Morgan")).toMatch(/between 10 and 15 characters/i);
  });

  test("filters name digits while preserving Unicode letters and legitimate separators", () => {
    const filtered = sanitizeNameInput("李 Mei O'Neil4");
    expect(filtered).toBe("李 Mei O'Neil");
    expect(validateFullName(filtered)).toBeNull();
  });

  test("filters non-digits from mobile input and accepts exactly ten digits", () => {
    const filtered = sanitizeIndianMobileInput("98a-765 43210");
    expect(filtered).toBe("9876543210");
    expect(validateIndianMobile(filtered)).toBeNull();
  });

  test("does not silently truncate an overlong mobile number", () => {
    const filtered = sanitizeIndianMobileInput("98765432101");
    expect(filtered).toBe("98765432101");
    expect(validateIndianMobile(filtered)).toMatch(/exactly 10 digits/i);
  });
});

test.describe("form validation rejects malformed API input before persistence", () => {
  test("registration API rejects invalid fields", async ({ request, baseURL }) => {
    const response = await request.post("/api/auth/register", {
      headers: { Origin: sameOriginHeader(baseURL) },
      data: { fullName: "1234", email: "not-an-email", password: "short" },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ success: false });
  });

  test("login API rejects malformed email without looking up an account", async ({ request, baseURL }) => {
    const response = await request.post("/api/auth/login", {
      headers: { Origin: sameOriginHeader(baseURL) },
      data: { email: "missing-domain", password: "non-empty-test-password" },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ success: false });
  });

  test("public alumni API rejects invalid profile values before database access", async ({ request, baseURL }) => {
    const response = await request.post("/api/alumni", {
      headers: { Origin: sameOriginHeader(baseURL) },
      data: { name: "Test123", email: "bad-email", phone: "letters" },
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ success: false });
  });

  test("event registration API rejects missing required fields before database access", async ({ request, baseURL }) => {
    const response = await request.post("/api/events/register", {
      headers: { Origin: sameOriginHeader(baseURL) },
      data: {},
    });

    expect(response.status()).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ success: false });
  });

  test("event registration API rejects alphabetic mobile input before database access", async ({ request, baseURL }) => {
    const response = await request.post("/api/events/register", {
      headers: { Origin: sameOriginHeader(baseURL) },
      data: {
        event_id: 1,
        first_name: "Asha",
        last_name: "Patel",
        email: "asha@example.invalid",
        phone: "98765abc10",
        graduation_year: "2020",
        department: "Computer Engineering",
        guest_count: 0,
        agreed_to_terms: true,
      },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toMatch(/exactly 10 digits/i);
  });

  test("profile API rejects an 11-digit mobile number before database access", async ({ request, baseURL }) => {
    const response = await request.post("/api/alumni", {
      headers: { Origin: sameOriginHeader(baseURL) },
      data: { name: "Asha Patel", email: "asha@example.invalid", phone: "98765432101" },
    });

    expect(response.status()).toBe(400);
    expect((await response.json()).error).toMatch(/exactly 10 digits/i);
  });
});

test.describe("public form validation feedback", () => {
  test("registration name filters digits but preserves Unicode letters and name punctuation", async ({ page }) => {
    await page.goto("/register");
    const name = page.locator("#register-fullname");
    await name.fill("Élodie O'Neil-2");

    await expect(name).toHaveValue("Élodie O'Neil-");
  });

  test("invite form mobile input filters non-digits and reports overlong values", async ({ page }) => {
    await page.goto("/invite");
    const name = page.getByPlaceholder("Enter your full name");
    const mobile = page.getByPlaceholder("9876543210");
    await name.fill("李 Mei4 O'Neil");
    await page.getByPlaceholder("Enter your email").fill("mei@example.invalid");
    await mobile.fill("98765abc-432109876");

    await expect(name).toHaveValue("李 Mei O'Neil");
    await expect(mobile).toHaveValue("98765432109876");
    await page.getByRole("button", { name: /next step/i }).click();
    await expect(page.getByText(/exactly 10 digits/i)).toBeVisible();
  });

  test("registration shows field guidance and does not submit a short password", async ({ page }) => {
    await page.goto("/register");
    await page.locator("#register-fullname").fill("Asha Patel");
    await page.locator("#register-email").fill("asha@example.invalid");
    await page.locator("#register-password").fill("short1");
    await page.locator("#register-confirm-password").fill("short1");
    await page.locator("#agree-terms").check();
    await page.getByRole("button", { name: /Create Account|Register/i }).click();

    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  });

  test("contact form keeps invalid values and shows field-level errors", async ({ page }) => {
    await page.goto("/contact");
    const email = page.locator('input[type="email"]').first();
    await email.fill("invalid-email");
    await page.getByRole("button", { name: /send message|submit/i }).click();

    await expect(page.getByText(/valid email/i).first()).toBeVisible();
    await expect(email).toHaveValue("invalid-email");
  });

  test("contact form accepts valid values and displays its mock confirmation", async ({ page }) => {
    await page.goto("/contact");
    await page.getByPlaceholder("e.g. Rahul Sharma").fill("Asha Patel");
    await page.getByPlaceholder("name@example.com").fill("asha@example.invalid");
    await page.getByPlaceholder("Brief summary of your inquiry...").fill("Alumni directory update");
    await page.getByPlaceholder("Write your message, batch details, request, or questions here...").fill("Please help me update my alumni directory information.");
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.getByText(/Thank you, Asha Patel/i)).toBeVisible({ timeout: 5_000 });
  });
});
