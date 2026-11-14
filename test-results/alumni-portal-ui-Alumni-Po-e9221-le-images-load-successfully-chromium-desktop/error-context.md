# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: alumni-portal-ui.spec.ts >> Alumni Portal — UI functional test register >> UI-031 — visible images load successfully
- Location: tests\alumni-portal-ui.spec.ts:148:3

# Error details

```
Error: Image 11 failed to load

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "Tolani Logo TOLANI F. G. POLYTECHNIC ALUMNI PORTAL" [ref=e5] [cursor=pointer]:
          - /url: /
          - img "Tolani Logo" [ref=e7]
          - generic [ref=e8]:
            - generic [ref=e9]: TOLANI F. G. POLYTECHNIC
            - generic [ref=e10]: ALUMNI PORTAL
        - generic [ref=e11]:
          - link "Home" [ref=e12] [cursor=pointer]:
            - /url: /
          - link "Members" [ref=e13] [cursor=pointer]:
            - /url: /members
          - link "Departments" [ref=e14] [cursor=pointer]:
            - /url: /#departments
          - link "Events" [ref=e15] [cursor=pointer]:
            - /url: /events
          - link "Gallery" [ref=e16] [cursor=pointer]:
            - /url: /gallery
          - link "News" [ref=e17] [cursor=pointer]:
            - /url: /news
          - link "Contact" [ref=e18] [cursor=pointer]:
            - /url: /contact
          - link "Donation" [ref=e19] [cursor=pointer]:
            - /url: /donation
        - link "Login" [ref=e21] [cursor=pointer]:
          - /url: /login
    - generic [ref=e26]:
      - img "Tolani Campus" [ref=e28]
      - button [ref=e30] [cursor=pointer]
      - button [ref=e33] [cursor=pointer]
      - generic [ref=e36]:
        - paragraph [ref=e37]: Welcome to
        - heading "Tolani Alumni Portal" [level=1] [ref=e38]
        - paragraph [ref=e39]: Stay Connected. Stay Inspired.
        - paragraph [ref=e40]: A vibrant community of achievers, innovators and leaders from Tolani.
        - link "Explore Alumni" [ref=e41] [cursor=pointer]:
          - /url: /login
      - generic [ref=e44]:
        - button [ref=e45] [cursor=pointer]
        - button [ref=e46] [cursor=pointer]
        - button [ref=e47] [cursor=pointer]
        - button [ref=e48] [cursor=pointer]
    - generic [ref=e50]:
      - generic [ref=e58]:
        - generic [ref=e59]: 5,000+
        - generic [ref=e60]: Total Alumni
      - generic [ref=e66]:
        - generic [ref=e67]: 250+
        - generic [ref=e68]: Jobs Posted
      - generic [ref=e73]:
        - generic [ref=e74]: 30+
        - generic [ref=e75]: Events Organized
      - generic [ref=e84]:
        - generic [ref=e85]: 25+
        - generic [ref=e86]: Awards Won
    - generic [ref=e87]:
      - generic [ref=e89]:
        - link "View All Departments" [ref=e91] [cursor=pointer]:
          - /url: /departments
        - heading "Our Departments" [level=2] [ref=e94]
        - paragraph [ref=e95]: Explore departments and connect with alumni from your field.
      - generic [ref=e97]:
        - link "Computer Department 1200+ Alumni Explore Department" [ref=e98] [cursor=pointer]:
          - /url: /departments/computer
          - generic [ref=e109]:
            - heading "Computer Department" [level=3] [ref=e110]
            - generic [ref=e112]: 1200+ Alumni
            - generic [ref=e113]: Explore Department
        - link "Civil Department 1200+ Alumni Explore Department" [ref=e117] [cursor=pointer]:
          - /url: /departments/civil
          - generic [ref=e121]:
            - heading "Civil Department" [level=3] [ref=e122]
            - generic [ref=e124]: 1200+ Alumni
            - generic [ref=e125]: Explore Department
        - link "Electrical Department 1000+ Alumni Explore Department" [ref=e129] [cursor=pointer]:
          - /url: /departments/electrical
          - generic [ref=e137]:
            - heading "Electrical Department" [level=3] [ref=e138]
            - generic [ref=e140]: 1000+ Alumni
            - generic [ref=e141]: Explore Department
        - link "Mechanical Department 800+ Alumni Explore Department" [ref=e145] [cursor=pointer]:
          - /url: /departments/mechanical
          - generic [ref=e154]:
            - heading "Mechanical Department" [level=3] [ref=e155]
            - generic [ref=e157]: 800+ Alumni
            - generic [ref=e158]: Explore Department
        - link "CDDM Department 800+ Alumni Explore Department" [ref=e162] [cursor=pointer]:
          - /url: /departments/cddm
          - generic [ref=e171]:
            - heading "CDDM Department" [level=3] [ref=e172]
            - generic [ref=e174]: 800+ Alumni
            - generic [ref=e175]: Explore Department
        - link "Computer Department 1200+ Alumni Explore Department" [ref=e179] [cursor=pointer]:
          - /url: /departments/computer
          - generic [ref=e190]:
            - heading "Computer Department" [level=3] [ref=e191]
            - generic [ref=e193]: 1200+ Alumni
            - generic [ref=e194]: Explore Department
        - link "Civil Department 1200+ Alumni Explore Department" [ref=e198] [cursor=pointer]:
          - /url: /departments/civil
          - generic [ref=e202]:
            - heading "Civil Department" [level=3] [ref=e203]
            - generic [ref=e205]: 1200+ Alumni
            - generic [ref=e206]: Explore Department
        - link "Electrical Department 1000+ Alumni Explore Department" [ref=e210] [cursor=pointer]:
          - /url: /departments/electrical
          - generic [ref=e218]:
            - heading "Electrical Department" [level=3] [ref=e219]
            - generic [ref=e221]: 1000+ Alumni
            - generic [ref=e222]: Explore Department
        - link "Mechanical Department 800+ Alumni Explore Department" [ref=e226] [cursor=pointer]:
          - /url: /departments/mechanical
          - generic [ref=e235]:
            - heading "Mechanical Department" [level=3] [ref=e236]
            - generic [ref=e238]: 800+ Alumni
            - generic [ref=e239]: Explore Department
        - link "CDDM Department 800+ Alumni Explore Department" [ref=e243] [cursor=pointer]:
          - /url: /departments/cddm
          - generic [ref=e252]:
            - heading "CDDM Department" [level=3] [ref=e253]
            - generic [ref=e255]: 800+ Alumni
            - generic [ref=e256]: Explore Department
        - link "Computer Department 1200+ Alumni Explore Department" [ref=e260] [cursor=pointer]:
          - /url: /departments/computer
          - generic [ref=e271]:
            - heading "Computer Department" [level=3] [ref=e272]
            - generic [ref=e274]: 1200+ Alumni
            - generic [ref=e275]: Explore Department
        - link "Civil Department 1200+ Alumni Explore Department" [ref=e279] [cursor=pointer]:
          - /url: /departments/civil
          - generic [ref=e283]:
            - heading "Civil Department" [level=3] [ref=e284]
            - generic [ref=e286]: 1200+ Alumni
            - generic [ref=e287]: Explore Department
        - link "Electrical Department 1000+ Alumni Explore Department" [ref=e291] [cursor=pointer]:
          - /url: /departments/electrical
          - generic [ref=e299]:
            - heading "Electrical Department" [level=3] [ref=e300]
            - generic [ref=e302]: 1000+ Alumni
            - generic [ref=e303]: Explore Department
        - link "Mechanical Department 800+ Alumni Explore Department" [ref=e307] [cursor=pointer]:
          - /url: /departments/mechanical
          - generic [ref=e316]:
            - heading "Mechanical Department" [level=3] [ref=e317]
            - generic [ref=e319]: 800+ Alumni
            - generic [ref=e320]: Explore Department
        - link "CDDM Department 800+ Alumni Explore Department" [ref=e324] [cursor=pointer]:
          - /url: /departments/cddm
          - generic [ref=e333]:
            - heading "CDDM Department" [level=3] [ref=e334]
            - generic [ref=e336]: 800+ Alumni
            - generic [ref=e337]: Explore Department
    - generic [ref=e341]:
      - generic [ref=e342]:
        - heading "Upcoming Events" [level=2] [ref=e344]
        - link "View All Events" [ref=e346] [cursor=pointer]:
          - /url: /events
      - generic [ref=e349]:
        - generic [ref=e350]:
          - generic [ref=e351]:
            - img "Annual CDDM Fashion Show" [ref=e352]
            - generic [ref=e353]:
              - generic [ref=e354]: "20"
              - generic [ref=e355]: NOV
          - generic [ref=e356]:
            - generic [ref=e357]: Cultural Event
            - heading "Annual CDDM Fashion Show" [level=3] [ref=e358]
            - generic [ref=e359]: 06:00 PM
            - generic [ref=e363]: Tolani Auditorium
            - paragraph [ref=e367]: A grand fashion showcase by CDDM alumni and students, presenting original designs inspired by cultural heritage and modern trends.
            - link "Register Now" [ref=e368] [cursor=pointer]:
              - /url: /events/register?event=Annual%20CDDM%20Fashion%20Show
        - generic [ref=e371]:
          - generic [ref=e372]:
            - img "Alumni Donation Drive" [ref=e373]
            - generic [ref=e374]:
              - generic [ref=e375]: "08"
              - generic [ref=e376]: DEC
          - generic [ref=e377]:
            - generic [ref=e378]: CSR Event
            - heading "Alumni Donation Drive" [level=3] [ref=e379]
            - generic [ref=e380]: 10:00 AM
            - generic [ref=e384]: Online
            - paragraph [ref=e388]: Give back to your alma mater. Contribute to scholarships, lab upgrades and student welfare programs to support the next generation.
            - link "Register Now" [ref=e389] [cursor=pointer]:
              - /url: /events/register?event=Alumni%20Donation%20Drive
        - generic [ref=e392]:
          - generic [ref=e393]:
            - img "New Year Networking Bash" [ref=e394]
            - generic [ref=e395]:
              - generic [ref=e396]: "20"
              - generic [ref=e397]: DEC
          - generic [ref=e398]:
            - generic [ref=e399]: Social Event
            - heading "New Year Networking Bash" [level=3] [ref=e400]
            - generic [ref=e401]: 07:00 PM
            - generic [ref=e405]: Tolani Banquet Hall
            - paragraph [ref=e409]: End the year with an exciting networking event. Meet alumni from all departments, celebrate 2026 achievements and welcome 2027 together.
            - link "Register Now" [ref=e410] [cursor=pointer]:
              - /url: /events/register?event=New%20Year%20Networking%20Bash
    - generic [ref=e413]:
      - generic [ref=e414]:
        - heading "Gallery Highlights" [level=2] [ref=e416]
        - link "View All Gallery" [ref=e418] [cursor=pointer]:
          - /url: /gallery
      - generic [ref=e421]:
        - generic [ref=e422] [cursor=pointer]:
          - img "Alumni Meet 2026" [ref=e423]
          - paragraph [ref=e425]: Alumni Meet 2026
        - generic [ref=e426] [cursor=pointer]:
          - img "Virtual Alumni Reunion" [ref=e427]
          - paragraph [ref=e429]: Virtual Alumni Reunion
        - generic [ref=e430] [cursor=pointer]:
          - img "Networking Session" [ref=e431]
          - paragraph [ref=e433]: Networking Session
        - generic [ref=e434] [cursor=pointer]:
          - img "Campus Visit" [ref=e435]
          - paragraph [ref=e437]: Campus Visit
        - generic [ref=e438] [cursor=pointer]:
          - img "Guest Lecture Series" [ref=e439]
          - paragraph [ref=e441]: Guest Lecture Series
        - generic [ref=e442] [cursor=pointer]:
          - img "Cultural Night 2026" [ref=e443]
          - paragraph [ref=e445]: Cultural Night 2026
    - generic [ref=e446]:
      - generic [ref=e447]:
        - heading "News & Updates" [level=2] [ref=e449]
        - link "View All News" [ref=e451] [cursor=pointer]:
          - /url: /news
      - generic [ref=e454]:
        - generic [ref=e455]:
          - img "Tolani Alumni Association – Dar es Salaam, Tanzania Alumni Reunion 2026–27" [ref=e457]
          - generic [ref=e458]:
            - paragraph [ref=e459]: Tolani Alumni Association – Dar es Salaam, Tanzania Alumni Reunion 2026–27
            - paragraph [ref=e460]: Aug 05, 2026
        - generic [ref=e461]:
          - 'img "Building a Stronger Alumni Community: Northeast Chapters Virtual Reunion" [ref=e463]'
          - generic [ref=e464]:
            - paragraph [ref=e465]: "Building a Stronger Alumni Community: Northeast Chapters Virtual Reunion"
            - paragraph [ref=e466]: Aug 03, 2026
        - generic [ref=e467]:
          - 'img "Strengthening Connections: Virtual Alumni Reunion Central India" [ref=e469]'
          - generic [ref=e470]:
            - paragraph [ref=e471]: "Strengthening Connections: Virtual Alumni Reunion Central India"
            - paragraph [ref=e472]: Jul 31, 2026
    - generic [ref=e474]:
      - generic [ref=e482]:
        - paragraph [ref=e483]: Be a Part of Our Global Alumni Community
        - paragraph [ref=e484]: Reconnect. Collaborate. Grow Together.
      - button "Invite Alumni" [ref=e485] [cursor=pointer]
    - contentinfo [ref=e489]:
      - generic [ref=e491]:
        - generic [ref=e492]:
          - generic [ref=e493]:
            - img "Tolani" [ref=e495]
            - generic [ref=e496]:
              - generic [ref=e497]: TOLANI F.G POLYTECHNIC
              - generic [ref=e498]: ALUMNI PORTAL
          - paragraph [ref=e499]: The official alumni community of Tolani Foundation.
          - generic [ref=e500]:
            - link [ref=e501] [cursor=pointer]:
              - /url: "#"
            - link [ref=e504] [cursor=pointer]:
              - /url: "#"
            - link [ref=e509] [cursor=pointer]:
              - /url: "#"
            - link [ref=e512] [cursor=pointer]:
              - /url: "#"
            - link [ref=e516] [cursor=pointer]:
              - /url: "#"
        - generic [ref=e520]:
          - heading "Quick Links" [level=4] [ref=e521]
          - link "Alumni Directory" [ref=e522] [cursor=pointer]:
            - /url: /members
          - link "Jobs & Internships" [ref=e523] [cursor=pointer]:
            - /url: "#"
          - link "Events" [ref=e524] [cursor=pointer]:
            - /url: /events
          - link "Gallery" [ref=e525] [cursor=pointer]:
            - /url: /gallery
          - link "Contact Us" [ref=e526] [cursor=pointer]:
            - /url: /contact
        - generic [ref=e527]:
          - heading "Resources" [level=4] [ref=e528]
          - link "News Corner" [ref=e529] [cursor=pointer]:
            - /url: "#"
          - link "Success Stories" [ref=e530] [cursor=pointer]:
            - /url: "#"
          - link "Mentorship" [ref=e531] [cursor=pointer]:
            - /url: "#"
          - link "Batchmates" [ref=e532] [cursor=pointer]:
            - /url: "#"
          - link "Help & Support" [ref=e533] [cursor=pointer]:
            - /url: "#"
        - generic [ref=e534]:
          - heading "Support" [level=4] [ref=e535]
          - link "FAQs" [ref=e536] [cursor=pointer]:
            - /url: "#"
          - link "Privacy Policy" [ref=e537] [cursor=pointer]:
            - /url: "#"
          - link "Terms of Use" [ref=e538] [cursor=pointer]:
            - /url: "#"
        - generic [ref=e539]:
          - heading "Stay Connected" [level=4] [ref=e540]
          - generic [ref=e541]:
            - textbox "Enter your email" [ref=e542]
            - button [ref=e543] [cursor=pointer]
          - paragraph [ref=e547]: Get the latest updates and events straight to your inbox.
      - paragraph [ref=e550]: © 2026 Tolani Alumni Portal. All Rights Reserved.
  - button "Open Next.js Dev Tools" [ref=e556] [cursor=pointer]
  - alert [ref=e560]
```

# Test source

```ts
  57  |     const link = page.getByRole("link", { name: /Explore Department/i }).first();
  58  |     await expect(link).toBeVisible();
  59  |     await link.click();
  60  |     await expect(page).toHaveURL(/\/departments\//);
  61  |     await expect(page.locator("body")).toBeVisible();
  62  |   });
  63  | 
  64  |   test("UI-022 — members directory search accepts text and updates results", async ({ page }) => {
  65  |     await page.goto("/members");
  66  |     const search = page.getByPlaceholder(/Search by name, company, role/i);
  67  |     await expect(search).toBeVisible();
  68  |     await search.fill("qa-no-match-92741");
  69  |     await page.getByRole("button", { name: /^Search$/i }).click();
  70  |     await expect(page.getByText(/No Matching Alumni Found|No Alumni Registered Yet/i)).toBeVisible();
  71  |   });
  72  | 
  73  |   test("UI-023 — members directory filter controls are interactive", async ({ page }) => {
  74  |     await page.goto("/members");
  75  |     const selects = page.locator("select");
  76  |     expect(await selects.count()).toBeGreaterThanOrEqual(1);
  77  |     const first = selects.first();
  78  |     const options = await first.locator("option").evaluateAll(opts => opts.map(o => (o as HTMLOptionElement).value).filter(Boolean));
  79  |     if (options.length) {
  80  |       await first.selectOption(options[0]);
  81  |       await expect(first).toHaveValue(options[0]);
  82  |     }
  83  |   });
  84  | 
  85  |   test("UI-024 — events search filters visible event cards", async ({ page }) => {
  86  |     await page.goto("/events");
  87  |     const search = page.getByPlaceholder(/Search events by name, location/i);
  88  |     await expect(search).toBeVisible();
  89  |     await search.fill("qa-no-match-92741");
  90  |     await expect(page.getByText(/No events found matching your search/i)).toBeVisible();
  91  |   });
  92  | 
  93  |   test("UI-025 — events type filter changes the selected filter", async ({ page }) => {
  94  |     await page.goto("/events");
  95  |     const filter = page.getByRole("button", { name: "Virtual Event", exact: true });
  96  |     await expect(filter).toBeVisible();
  97  |     await filter.click();
  98  |     await expect(page.getByText(/All Events/i)).toBeVisible();
  99  |   });
  100 | 
  101 |   test("UI-026 — login form required fields are present and empty submission is constrained", async ({ page }) => {
  102 |     await page.goto("/login");
  103 |     const form = page.locator("form").first();
  104 |     await expect(form).toBeVisible();
  105 |     const required = form.locator("[required]");
  106 |     expect(await required.count()).toBeGreaterThan(0);
  107 |     const submit = form.locator('button[type="submit"], input[type="submit"]').first();
  108 |     await expect(submit).toBeVisible();
  109 |     await submit.click();
  110 |     const validity = await required.first().evaluate((el: HTMLInputElement) => el.checkValidity());
  111 |     expect(validity).toBe(false);
  112 |   });
  113 | 
  114 |   test("UI-027 — account registration form exposes required inputs", async ({ page }) => {
  115 |     await page.goto("/register");
  116 |     const form = page.locator("form").first();
  117 |     await expect(form).toBeVisible();
  118 |     expect(await form.locator("input").count()).toBeGreaterThanOrEqual(3);
  119 |     expect(await form.locator("[required]").count()).toBeGreaterThan(0);
  120 |   });
  121 | 
  122 |   test("UI-028 — contact form exposes fields and required-field validation", async ({ page }) => {
  123 |     await page.goto("/contact");
  124 |     const form = page.locator("form").first();
  125 |     await expect(form).toBeVisible();
  126 |     const required = form.locator("[required]");
  127 |     expect(await required.count()).toBeGreaterThan(0);
  128 |     const valid = await required.first().evaluate((el: HTMLInputElement) => el.checkValidity());
  129 |     expect(valid).toBe(false);
  130 |   });
  131 | 
  132 |   test("UI-029 — event registration form is displayed", async ({ page }) => {
  133 |     await page.goto("/events/register");
  134 |     await expect(page.locator("form").first()).toBeVisible();
  135 |     await expect(page.getByRole("button", { name: /Confirm Registration/i })).toBeVisible();
  136 |   });
  137 | 
  138 |   test("UI-030 — gallery category controls are clickable when present", async ({ page }) => {
  139 |     await page.goto("/gallery");
  140 |     const category = page.locator("button").filter({ hasText: /All|Campus|Event/i }).first();
  141 |     if (await category.count()) {
  142 |       await expect(category).toBeVisible();
  143 |       await category.click();
  144 |       await expect(page.locator("body")).toBeVisible();
  145 |     }
  146 |   });
  147 | 
  148 |   test("UI-031 — visible images load successfully", async ({ page }) => {
  149 |     await page.goto("/");
  150 |     const images = page.locator("img");
  151 |     const count = await images.count();
  152 |     expect(count).toBeGreaterThan(0);
  153 |     for (let i = 0; i < count; i++) {
  154 |       const img = images.nth(i);
  155 |       if (await img.isVisible()) {
  156 |         const loaded = await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
> 157 |         expect(loaded, `Image ${i} failed to load`).toBe(true);
      |                                                     ^ Error: Image 11 failed to load
  158 |       }
  159 |     }
  160 |   });
  161 | 
  162 |   test("UI-032 — browser console contains no uncaught page errors on homepage", async ({ page }) => {
  163 |     const errors: string[] = [];
  164 |     page.on("pageerror", error => errors.push(error.message));
  165 |     await page.goto("/");
  166 |     await page.waitForTimeout(1500);
  167 |     expect(errors, errors.join("\n")).toEqual([]);
  168 |   });
  169 | 
  170 |   test("UI-033 — common internal navigation link destinations are not empty", async ({ page }) => {
  171 |     await page.goto("/");
  172 |     const hrefs = await page.locator('a[href^="/"]').evaluateAll(els =>
  173 |       els.map(el => (el as HTMLAnchorElement).getAttribute("href")).filter(Boolean)
  174 |     );
  175 |     expect(hrefs.length).toBeGreaterThan(0);
  176 |     expect(hrefs.every(href => !!href && href.trim().length > 0)).toBe(true);
  177 |   });
  178 | 
  179 |   test("UI-034 — mobile viewport keeps page content visible without horizontal overflow", async ({ page }, testInfo) => {
  180 |     await page.setViewportSize({ width: 390, height: 844 });
  181 |     await page.goto("/");
  182 |     await expect(page.locator("body")).toBeVisible();
  183 |     const dimensions = await page.evaluate(() => ({
  184 |       viewport: document.documentElement.clientWidth,
  185 |       content: document.documentElement.scrollWidth,
  186 |     }));
  187 |     expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 2);
  188 |     await captureEvidence(page, testInfo, "UI-034-mobile-home.png");
  189 |   });
  190 | 
  191 |   test("UI-035 — tablet viewport renders homepage", async ({ page }, testInfo) => {
  192 |     await page.setViewportSize({ width: 768, height: 1024 });
  193 |     await page.goto("/");
  194 |     await expect(page.locator("body")).toBeVisible();
  195 |     await expect(page.getByRole("link", { name: /Members/i }).first()).toBeVisible();
  196 |     await captureEvidence(page, testInfo, "UI-035-tablet-home.png");
  197 |   });
  198 | 
  199 |   test("UI-036 — desktop viewport renders homepage", async ({ page }, testInfo) => {
  200 |     await page.setViewportSize({ width: 1366, height: 768 });
  201 |     await page.goto("/");
  202 |     await expect(page.locator("body")).toBeVisible();
  203 |     await captureEvidence(page, testInfo, "UI-036-desktop-home.png");
  204 |   });
  205 | });
  206 | 
```