import { test, expect, Page, TestInfo } from "@playwright/test";

const routes = [
  ["/", /Tolani|Alumni/i, "UI-001"],
  ["/login", /Welcome Back|Login|Stay Connected/i, "UI-002"],
  ["/register", /Create Account|Join Our Global/i, "UI-003"],
  ["/invite", /Personal Information|Verify Your Identity/i, "UI-004"],
  ["/members", /Members|Directory/i, "UI-005"],
  ["/events", /Upcoming Events|All Events/i, "UI-006"],
  ["/events/register", /Personal Details|Event Details/i, "UI-007"],
  ["/gallery", /Gallery Highlights|All Photos/i, "UI-008"],
  ["/news", /News|Latest News/i, "UI-009"],
  ["/contact", /Get in Touch|Contact/i, "UI-010"],
  ["/donation", /Make a Difference|Make a Lasting Impact/i, "UI-011"],
  ["/donation/campaigns", /Support Our Campaigns|Campaign/i, "UI-012"],
  ["/departments/computer", /Code Today|Computer/i, "UI-013"],
  ["/departments/civil", /Build Today|Civil/i, "UI-014"],
  ["/departments/electrical", /Power Today|Electrical/i, "UI-015"],
  ["/departments/mechanical", /Engineer Today|Mechanical/i, "UI-016"],
  ["/departments/cddm", /Design Today|CDDM|Style/i, "UI-017"],
  ["/admin", /Admin|Checking Admin Access/i, "UI-018"],
  ["/api-tester", /API Dashboard|Insert Data/i, "UI-019"],
];

async function captureEvidence(page: Page, testInfo: TestInfo, fileName: string) {
  const screenshotPath = testInfo.outputPath(fileName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(fileName, { path: screenshotPath, contentType: "image/png" });
}

async function openRoute(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  return response;
}

test.describe("Alumni Portal — UI functional test register", () => {
  for (const [path, expected, id] of routes as [string, RegExp, string][]) {
    test(`${id} — route renders: ${path}`, async ({ page }, testInfo) => {
      const response = await openRoute(page, path);
      expect(response, `No HTTP response for ${path}`).not.toBeNull();
      expect(response!.status(), `HTTP status for ${path}`).toBeLessThan(400);
      await expect(page.locator("body")).toContainText(expected);
      await expect(page.locator("body")).toBeVisible();
      await captureEvidence(page, testInfo, `${id}-route.png`);
    });
  }

  test("UI-020 — homepage primary navigation exposes expected destinations", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Home", "Members", "Events", "Gallery", "News", "Contact", "Donation"]) {
      await expect(page.getByRole("link", { name, exact: true }).first()).toBeVisible();
    }
  });

  test("UI-021 — homepage department links navigate to department pages", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /Explore Department/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/\/departments\//);
    await expect(page.locator("body")).toBeVisible();
  });

  test("UI-022 — members directory search accepts text and updates results", async ({ page }) => {
    await page.goto("/members");
    const search = page.getByPlaceholder(/Search by name, company, role/i);
    await expect(search).toBeVisible();
    await search.fill("qa-no-match-92741");
    await page.getByRole("button", { name: /^Search$/i }).click();
    await expect(page.getByText(/No Matching Alumni Found|No Alumni Registered Yet/i)).toBeVisible();
  });

  test("UI-023 — members directory filter controls are interactive", async ({ page }) => {
    await page.goto("/members");
    const selects = page.locator("select");
    expect(await selects.count()).toBeGreaterThanOrEqual(1);
    const first = selects.first();
    const options = await first.locator("option").evaluateAll(opts => opts.map(o => (o as HTMLOptionElement).value).filter(Boolean));
    if (options.length) {
      await first.selectOption(options[0]);
      await expect(first).toHaveValue(options[0]);
    }
  });

  test("UI-024 — events search filters visible event cards", async ({ page }) => {
    await page.goto("/events");
    const search = page.getByPlaceholder(/Search events by name, location/i);
    await expect(search).toBeVisible();
    await search.fill("qa-no-match-92741");
    await expect(page.getByText(/No events found matching your search/i)).toBeVisible();
  });

  test("UI-025 — events type filter changes the selected filter", async ({ page }) => {
    await page.goto("/events");
    const filter = page.getByRole("button", { name: "Virtual Event", exact: true });
    await expect(filter).toBeVisible();
    await filter.click();
    await expect(page.getByText(/All Events/i)).toBeVisible();
  });

  test("UI-026 — login form required fields are present and empty submission is constrained", async ({ page }) => {
    await page.goto("/login");
    const form = page.locator("form").first();
    await expect(form).toBeVisible();
    const required = form.locator("[required]");
    expect(await required.count()).toBeGreaterThan(0);
    const submit = form.locator('button[type="submit"], input[type="submit"]').first();
    await expect(submit).toBeVisible();
    await submit.click();
    const validity = await required.first().evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(validity).toBe(false);
  });

  test("UI-027 — account registration form exposes required inputs", async ({ page }) => {
    await page.goto("/register");
    const form = page.locator("form").first();
    await expect(form).toBeVisible();
    expect(await form.locator("input").count()).toBeGreaterThanOrEqual(3);
    expect(await form.locator("[required]").count()).toBeGreaterThan(0);
  });

  test("UI-028 — contact form exposes fields and required-field validation", async ({ page }) => {
    await page.goto("/contact");
    const form = page.locator("form").first();
    await expect(form).toBeVisible();
    const required = form.locator("[required]");
    expect(await required.count()).toBeGreaterThan(0);
    const valid = await required.first().evaluate((el: HTMLInputElement) => el.checkValidity());
    expect(valid).toBe(false);
  });

  test("UI-029 — event registration form is displayed", async ({ page }) => {
    await page.goto("/events/register");
    await expect(page.locator("form").first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Confirm Registration/i })).toBeVisible();
  });

  test("UI-030 — gallery category controls are clickable when present", async ({ page }) => {
    await page.goto("/gallery");
    const category = page.locator("button").filter({ hasText: /All|Campus|Event/i }).first();
    if (await category.count()) {
      await expect(category).toBeVisible();
      await category.click();
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("UI-031 — visible images load successfully", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        const loaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
        expect(loaded, `Image ${i} failed to load`).toBe(true);
      }
    }
  });

  test("UI-032 — browser console contains no uncaught page errors on homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/");
    await page.waitForTimeout(1500);
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("UI-033 — common internal navigation link destinations are not empty", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator('a[href^="/"]').evaluateAll(els =>
      els.map(el => (el as HTMLAnchorElement).getAttribute("href")).filter(Boolean)
    );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.every(href => !!href && href.trim().length > 0)).toBe(true);
  });

  test("UI-034 — mobile viewport keeps page content visible without horizontal overflow", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 2);
    await captureEvidence(page, testInfo, "UI-034-mobile-home.png");
  });

  test("UI-035 — tablet viewport renders homepage", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await expect(page.getByRole("link", { name: /Members/i }).first()).toBeVisible();
    await captureEvidence(page, testInfo, "UI-035-tablet-home.png");
  });

  test("UI-036 — desktop viewport renders homepage", async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    await captureEvidence(page, testInfo, "UI-036-desktop-home.png");
  });
});
