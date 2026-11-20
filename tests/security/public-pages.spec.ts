import { expect, test } from "@playwright/test";

test("public pages still render after session and authorization changes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  for (const [route, text] of [
    ["/", /Tolani|Alumni/i],
    ["/login", /Welcome Back|Login/i],
    ["/register", /Join Our Global|Create Account/i],
    ["/invite", /Personal Information|Verify Your Identity/i],
    ["/members", /Members|Directory/i],
    ["/events", /Upcoming Events|All Events/i],
  ] as const) {
    const response = await page.goto(route, { waitUntil: "domcontentloaded" });
    expect(response?.status(), route).toBeLessThan(400);
    await expect(page.locator("body")).toContainText(text);
  }

  expect(errors).toEqual([]);
});

test("registration form enforces the stronger password length client side", async ({ page }) => {
  await page.goto("/register");
  const password = page.locator("#register-password");
  if (await password.count()) {
    await page.locator("#register-fullname").fill("Security Test User");
    await page.locator("#register-email").fill("security-test@example.invalid");
    await password.fill("short1");
    await page.locator("#register-confirm-password").fill("short1");
    await page.getByRole("button", { name: /Create Account|Register/i }).click();
    await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
  }
});
