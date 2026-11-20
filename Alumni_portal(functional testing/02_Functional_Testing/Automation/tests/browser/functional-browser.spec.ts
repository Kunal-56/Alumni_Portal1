import { test, expect, Page } from "@playwright/test";

const routes = [
  ["/", /Tolani|Alumni/i, "FT-BR-001"],
  ["/login", /login|welcome back|sign in/i, "FT-BR-002"],
  ["/register", /create account|register|sign up/i, "FT-BR-003"],
  ["/invite", /personal information|verify your identity|invite/i, "FT-BR-004"],
  ["/members", /alumni|members/i, "FT-BR-005"],
  ["/events", /events|upcoming/i, "FT-BR-006"],
  ["/events/register", /register|event/i, "FT-BR-007"],
  ["/gallery", /gallery|photos/i, "FT-BR-008"],
  ["/news", /news|updates/i, "FT-BR-009"],
  ["/contact", /contact|get in touch/i, "FT-BR-010"],
  ["/donation", /donat|support/i, "FT-BR-011"],
  ["/donation/campaigns", /campaign|donat/i, "FT-BR-012"],
  ["/departments/computer", /computer/i, "FT-BR-013"],
  ["/departments/civil", /civil/i, "FT-BR-014"],
  ["/departments/electrical", /electrical/i, "FT-BR-015"],
  ["/departments/mechanical", /mechanical/i, "FT-BR-016"],
  ["/departments/cddm", /cddm|computer/i, "FT-BR-017"],
] as const;

async function visiblePageCheck(page: Page, route: string, headingPattern: RegExp) {
  const response = await page.goto(route, { waitUntil: "domcontentloaded" });
  expect(response, `No navigation response for ${route}`).not.toBeNull();
  expect(response!.status(), `HTTP status for ${route}`).toBeLessThan(500);
  await expect(page.locator("body")).toBeVisible();
  const bodyText = (await page.locator("body").innerText()).trim();
  expect(bodyText.length, `Page body should not be empty: ${route}`).toBeGreaterThan(20);
  expect(bodyText, `Expected route-specific content on ${route}`).toMatch(headingPattern);
}

test.describe("Alumni Portal - browser functional route checks", () => {
  for (const [route, expected, id] of routes) {
    test(`${id} ${route} renders expected page content`, async ({ page }) => {
      await visiblePageCheck(page, route, expected);
    });
  }

  test("FT-BR-018 Login form exposes email and password inputs", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"], input[name*="email" i]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("FT-BR-019 Registration form exposes required account fields", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator('input[type="email"], input[name*="email" i]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("FT-BR-020 Members page provides a usable search field when present", async ({ page }) => {
    await page.goto("/members");
    const search = page.locator('input[placeholder*="search" i], input[aria-label*="search" i]').first();
    if (await search.count()) {
      await expect(search).toBeVisible();
      await search.fill("QA-Functional-Search");
      await expect(search).toHaveValue("QA-Functional-Search");
    } else {
      test.info().annotations.push({ type: "observation", description: "No identifiable search input found on Members page." });
    }
  });
});
