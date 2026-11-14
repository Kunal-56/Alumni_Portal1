# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: alumni-portal-ui.spec.ts >> Alumni Portal — UI functional test register >> UI-028 — contact form exposes fields and required-field validation
- Location: tests\alumni-portal-ui.spec.ts:122:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
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
    - generic [ref=e28]:
      - generic [ref=e29]: Alumni Relations & Helpdesk
      - heading "Get in Touch with Your Alma Mater" [level=1] [ref=e30]
      - paragraph [ref=e31]: Whether you want to reconnect with batchmates, plan a reunion, mentor diploma students, request transcripts, or collaborate on campus initiatives, we are always here to help.
      - generic [ref=e32]:
        - generic [ref=e33]:
          - generic [ref=e34]: 5,000+
          - generic [ref=e35]: Global Alumni
        - generic [ref=e36]:
          - generic [ref=e37]: < 12 Hrs
          - generic [ref=e38]: Avg. Response Time
        - generic [ref=e39]:
          - generic [ref=e40]: 100%
          - generic [ref=e41]: Support Dedication
        - generic [ref=e42]:
          - generic [ref=e43]: Adipur
          - generic [ref=e44]: Gandhidham Campus
    - main [ref=e45]:
      - generic [ref=e46]:
        - generic [ref=e47]:
          - heading "Campus Location" [level=3] [ref=e52]
          - paragraph [ref=e53]: Tolani F. G. Polytechnic, Post Box No. 11, Adipur (Kachchh), Gujarat 370205.
          - link "View on Map" [ref=e54] [cursor=pointer]:
            - /url: "#campus-map"
        - generic [ref=e57]:
          - heading "Direct Helpline" [level=3] [ref=e61]
          - paragraph [ref=e62]:
            - text: "Tel:"
            - link "+91 (02836) 260249" [ref=e63] [cursor=pointer]:
              - /url: tel:+912836260249
          - paragraph [ref=e64]:
            - text: "Mob:"
            - link "+91 98252 00000" [ref=e65] [cursor=pointer]:
              - /url: tel:+919825200000
          - text: Mon - Sat, 9am to 5pm
        - generic [ref=e66]:
          - heading "Email Inquiries" [level=3] [ref=e71]
          - paragraph [ref=e72]:
            - text: "Alumni:"
            - link "alumni@tolani.ac.in" [ref=e73] [cursor=pointer]:
              - /url: mailto:alumni@tolani.ac.in
          - paragraph [ref=e74]:
            - text: "General:"
            - link "info@tfgp.ac.in" [ref=e75] [cursor=pointer]:
              - /url: mailto:info@tfgp.ac.in
          - text: Fast digital turnaround
        - generic [ref=e76]:
          - heading "Visiting Hours" [level=3] [ref=e81]
          - paragraph [ref=e82]:
            - strong [ref=e83]: "Mon – Fri:"
            - text: 9:00 AM – 5:00 PM
          - paragraph [ref=e84]:
            - strong [ref=e85]: "Saturday:"
            - text: 9:00 AM – 1:00 PM
          - text: Closed on Sundays & Public Holidays
      - generic [ref=e86]:
        - generic [ref=e87]:
          - generic [ref=e88]:
            - generic [ref=e89]:
              - heading "Send an Inquiry or Message" [level=2] [ref=e90]
              - paragraph [ref=e93]: Fill in your details below and our team will get in touch with you.
            - generic [ref=e94]: Tolani Alumni Desk
          - generic [ref=e95]:
            - generic [ref=e96]:
              - generic [ref=e97]: "I am contacting as: *"
              - generic [ref=e98]:
                - button "Alumnus / Alumna" [ref=e99] [cursor=pointer]
                - button "Faculty / Staff" [ref=e100] [cursor=pointer]
                - button "Other" [ref=e101] [cursor=pointer]
            - generic [ref=e102]:
              - generic [ref=e103]:
                - generic [ref=e104]: Full Name *
                - textbox "e.g. Rahul Sharma" [ref=e105]
              - generic [ref=e106]:
                - generic [ref=e107]: Email Address *
                - textbox "name@example.com" [ref=e108]
            - generic [ref=e109]:
              - generic [ref=e110]:
                - generic [ref=e111]: Phone / WhatsApp Number
                - textbox "+91 98765 43210" [ref=e112]
              - generic [ref=e113]:
                - generic [ref=e114]: Department
                - combobox [ref=e115] [cursor=pointer]:
                  - option "Computer Engineering" [selected]
                  - option "Mechanical Engineering"
                  - option "Civil Engineering"
                  - option "Electrical Engineering"
                  - option "Commercial Diploma in Design & Mfg. (CDDM)"
                  - option "General / Administration"
            - generic [ref=e116]:
              - generic [ref=e117]:
                - generic [ref=e118]: Graduation Year / Batch
                - textbox "e.g. 2018 or 2022" [ref=e119]
              - generic [ref=e120]:
                - generic [ref=e121]: Subject Category *
                - combobox [ref=e122] [cursor=pointer]:
                  - option "General Reconnect / Greetings" [selected]
                  - option "Alumni Meet & Batch Reunions"
                  - option "Student Mentorship & Guest Lecture"
                  - option "Transcripts & Degree Verification"
                  - option "Offer Jobs or Internships"
                  - option "Donations & Giving Support"
                  - option "Portal Login / Technical Issue"
            - generic [ref=e123]:
              - generic [ref=e124]: Subject / Topic *
              - textbox "Brief summary of your inquiry..." [ref=e125]
            - generic [ref=e126]:
              - generic [ref=e127]:
                - generic [ref=e128]: Detailed Message *
                - generic [ref=e129]: 0 characters
              - textbox "Write your message, batch details, request, or questions here..." [ref=e130]
            - generic [ref=e131]:
              - checkbox "Send a confirmation summary copy to my email address" [checked] [ref=e132]
              - generic [ref=e133] [cursor=pointer]: Send a confirmation summary copy to my email address
            - generic [ref=e134]:
              - button "Send Message" [ref=e135] [cursor=pointer]
              - paragraph [ref=e140]: 🔒 Messages are securely handled by Tolani Alumni Relations.
        - generic [ref=e141]:
          - generic [ref=e142]:
            - generic [ref=e149]:
              - heading "Key Coordinators" [level=3] [ref=e150]
              - paragraph [ref=e151]: Reach the respective officer directly
            - generic [ref=e152]:
              - generic [ref=e161]:
                - text: Central Alumni Cell
                - generic [ref=e162]: Prof. D. B. Patel
                - generic [ref=e163]: Alumni Relations Officer
                - generic [ref=e164]:
                  - link "alumni-cell@tolani.ac.in" [ref=e165] [cursor=pointer]:
                    - /url: mailto:alumni-cell@tolani.ac.in
                  - generic [ref=e169]: +91 2836 260249 Ext. 104
              - generic [ref=e178]:
                - text: TPO & Industry Relations
                - generic [ref=e179]: Prof. K. M. Mehta
                - generic [ref=e180]: Training & Placement Officer
                - generic [ref=e181]:
                  - link "placement@tolani.ac.in" [ref=e182] [cursor=pointer]:
                    - /url: mailto:placement@tolani.ac.in
                  - generic [ref=e186]: +91 2836 260249 Ext. 112
              - generic [ref=e195]:
                - text: Examination & Records
                - generic [ref=e196]: Academic Verification Desk
                - generic [ref=e197]: Transcripts & Student Section
                - generic [ref=e198]:
                  - link "transcripts@tolani.ac.in" [ref=e199] [cursor=pointer]:
                    - /url: mailto:transcripts@tolani.ac.in
                  - generic [ref=e203]: +91 2836 260249 Ext. 108
              - generic [ref=e214]:
                - text: Student Affairs
                - generic [ref=e215]: Innovation & Startup Cell
                - generic [ref=e216]: Incubation & Student Mentorship
                - generic [ref=e217]:
                  - link "mentorship@tolani.ac.in" [ref=e218] [cursor=pointer]:
                    - /url: mailto:mentorship@tolani.ac.in
                  - generic [ref=e222]: +91 2836 260249 Ext. 120
          - generic [ref=e225]:
            - heading "Connect on Social Channels" [level=4] [ref=e226]
            - paragraph [ref=e227]: Join 5,000+ Tolani alumni sharing updates, achievements & reunions online.
            - generic [ref=e228]:
              - link "LinkedIn" [ref=e229] [cursor=pointer]:
                - /url: https://linkedin.com
              - link "Facebook" [ref=e234] [cursor=pointer]:
                - /url: https://facebook.com
              - link "Twitter" [ref=e237] [cursor=pointer]:
                - /url: https://twitter.com
              - link "Instagram" [ref=e240] [cursor=pointer]:
                - /url: https://instagram.com
              - link "YouTube" [ref=e244] [cursor=pointer]:
                - /url: https://youtube.com
      - generic [ref=e248]:
        - generic [ref=e249]:
          - text: Got Questions?
          - heading "Frequently Asked Questions by Alumni" [level=3] [ref=e250]
          - paragraph [ref=e251]: Find quick answers to common inquiries regarding reunions, memberships, and records.
        - generic [ref=e252]:
          - generic [ref=e253]:
            - button "How can I update my profile and contact details in the Alumni Directory?" [ref=e254] [cursor=pointer]
            - generic [ref=e259]: You can update your personal, academic, and professional details by logging into your portal account or by submitting an inquiry here with your full name, roll number, and graduation year.
          - button "How do I request official transcripts or degree verification from the institute?" [ref=e261] [cursor=pointer]
          - button "Can alumni organize a batch reunion or departmental meet on campus?" [ref=e267] [cursor=pointer]
          - button "How can I volunteer to mentor current students or conduct a guest lecture?" [ref=e273] [cursor=pointer]
          - button "How can I contribute or donate to campus development initiatives?" [ref=e279] [cursor=pointer]
      - generic [ref=e284]:
        - generic [ref=e285]:
          - generic [ref=e286]:
            - text: Visit Campus
            - heading "Tolani F. G. Polytechnic Campus Location" [level=3] [ref=e287]
            - paragraph [ref=e288]: Post Box No. 11, Adipur (Kachchh), Gujarat 370205, India
          - link "Open in Google Maps" [ref=e289] [cursor=pointer]:
            - /url: https://maps.google.com/?q=Tolani+Foundation+Gandhidham+Polytechnic+Adipur
        - generic [ref=e294]:
          - iframe [ref=e296]:
            - link "Open in Maps (opens in new tab)" [ref=f1e4] [cursor=pointer]:
              - /url: undefined
              - text: Open in Maps
          - generic [ref=e297]:
            - heading "Travel & Connectivity" [level=4] [ref=e298]
            - generic [ref=e299]:
              - generic [ref=e300]:
                - generic [ref=e301]: 🚆
                - generic [ref=e302]:
                  - strong [ref=e303]: "By Train:"
                  - paragraph [ref=e304]: "Adipur Junction: ~2 km awayGandhidham Junction: ~8 km away"
              - generic [ref=e305]:
                - generic [ref=e306]: ✈️
                - generic [ref=e307]:
                  - strong [ref=e308]: "By Air:"
                  - paragraph [ref=e309]: "Kandla Airport: ~6 kmBhuj Airport: ~55 km"
              - generic [ref=e310]:
                - generic [ref=e311]: 🚌
                - generic [ref=e312]:
                  - strong [ref=e313]: "By Road / Bus:"
                  - paragraph [ref=e314]: "Adipur GSRTC Bus Station: 1.5 km away with frequent connectivity to Ahmedabad & Rajkot."
    - contentinfo [ref=e315]:
      - generic [ref=e317]:
        - generic [ref=e318]:
          - generic [ref=e319]:
            - img "Tolani" [ref=e321]
            - generic [ref=e322]:
              - generic [ref=e323]: TOLANI
              - generic [ref=e324]: ALUMNI PORTAL
          - paragraph [ref=e325]: The official alumni community of Tolani Foundation Gandhidham Polytechnic.
          - generic [ref=e326]:
            - link [ref=e327] [cursor=pointer]:
              - /url: "#"
            - link [ref=e330] [cursor=pointer]:
              - /url: "#"
            - link [ref=e335] [cursor=pointer]:
              - /url: "#"
            - link [ref=e338] [cursor=pointer]:
              - /url: "#"
            - link [ref=e342] [cursor=pointer]:
              - /url: "#"
        - generic [ref=e346]:
          - heading "Quick Links" [level=4] [ref=e347]
          - generic [ref=e348]:
            - link "Alumni Directory" [ref=e349] [cursor=pointer]:
              - /url: /members
            - link "Events & Meets" [ref=e350] [cursor=pointer]:
              - /url: /events
            - link "Campus Gallery" [ref=e351] [cursor=pointer]:
              - /url: /gallery
            - link "Donations & Giving" [ref=e352] [cursor=pointer]:
              - /url: /donation
            - link "Contact Us" [ref=e353] [cursor=pointer]:
              - /url: /contact
        - generic [ref=e354]:
          - heading "Departments" [level=4] [ref=e355]
          - generic [ref=e356]:
            - link "Computer Engineering" [ref=e357] [cursor=pointer]:
              - /url: /departments/computer
            - link "Mechanical Engineering" [ref=e358] [cursor=pointer]:
              - /url: /departments/mechanical
            - link "Civil Engineering" [ref=e359] [cursor=pointer]:
              - /url: /departments/civil
            - link "Electrical Engineering" [ref=e360] [cursor=pointer]:
              - /url: /departments/electrical
            - link "CDDM Department" [ref=e361] [cursor=pointer]:
              - /url: /departments/cddm
        - generic [ref=e362]:
          - heading "Support & Help" [level=4] [ref=e363]
          - generic [ref=e364]:
            - link "Campus Directions" [ref=e365] [cursor=pointer]:
              - /url: /contact#campus-map
            - link "Transcripts Desk" [ref=e366] [cursor=pointer]:
              - /url: mailto:transcripts@tolani.ac.in
            - link "Privacy Policy" [ref=e367] [cursor=pointer]:
              - /url: "#"
            - link "Terms of Use" [ref=e368] [cursor=pointer]:
              - /url: "#"
        - generic [ref=e369]:
          - heading "Stay Connected" [level=4] [ref=e370]
          - generic [ref=e371]:
            - textbox "Enter your email" [ref=e372]
            - button "Subscribe" [ref=e373] [cursor=pointer]
          - paragraph [ref=e377]: Get the latest alumni newsletters & reunion invitations directly in your inbox.
      - paragraph [ref=e379]: © 2026 Tolani Alumni Portal. All Rights Reserved. Tolani Foundation Gandhidham Polytechnic.
  - button "Open Next.js Dev Tools" [ref=e385] [cursor=pointer]
  - alert [ref=e389]
```

# Test source

```ts
  27  |   await page.screenshot({ path: screenshotPath, fullPage: true });
  28  |   await testInfo.attach(fileName, { path: screenshotPath, contentType: "image/png" });
  29  | }
  30  | 
  31  | async function openRoute(page: Page, path: string) {
  32  |   const response = await page.goto(path, { waitUntil: "domcontentloaded" });
  33  |   return response;
  34  | }
  35  | 
  36  | test.describe("Alumni Portal — UI functional test register", () => {
  37  |   for (const [path, expected, id] of routes as [string, RegExp, string][]) {
  38  |     test(`${id} — route renders: ${path}`, async ({ page }, testInfo) => {
  39  |       const response = await openRoute(page, path);
  40  |       expect(response, `No HTTP response for ${path}`).not.toBeNull();
  41  |       expect(response!.status(), `HTTP status for ${path}`).toBeLessThan(400);
  42  |       await expect(page.locator("body")).toContainText(expected);
  43  |       await expect(page.locator("body")).toBeVisible();
  44  |       await captureEvidence(page, testInfo, `${id}-route.png`);
  45  |     });
  46  |   }
  47  | 
  48  |   test("UI-020 — homepage primary navigation exposes expected destinations", async ({ page }) => {
  49  |     await page.goto("/");
  50  |     for (const name of ["Home", "Members", "Events", "Gallery", "News", "Contact", "Donation"]) {
  51  |       await expect(page.getByRole("link", { name, exact: true }).first()).toBeVisible();
  52  |     }
  53  |   });
  54  | 
  55  |   test("UI-021 — homepage department links navigate to department pages", async ({ page }) => {
  56  |     await page.goto("/");
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
> 127 |     expect(await required.count()).toBeGreaterThan(0);
      |                                    ^ Error: expect(received).toBeGreaterThan(expected)
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
  157 |         expect(loaded, `Image ${i} failed to load`).toBe(true);
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