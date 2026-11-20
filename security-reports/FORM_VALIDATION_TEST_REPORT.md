# Alumni Portal Form Validation and QA Report

**Project:** `D:\Alumni_Portal1`  
**Assessment date:** 2026-11-18  
**Scope:** Form/input discovery, validation paths, targeted validation fixes, safe test authoring and static verification. No database, production account, or production records were used.

## Executive summary

The application contains 13 JSX `<form>` declarations: account registration, two login implementations, profile invitation, alumni creation modal, four admin content forms, API tester, contact inquiry, event registration, and two donation dialogs. Several pages also have search, filter, or newsletter fields that do not submit a record. The contact, event-registration, and donation screens are UI simulations; their success screens do not prove backend persistence. The event-registration API is separate from its UI and was not wired into this task because that changes the existing workflow and requires a stable event ID contract.

Shared validation in [inputValidation.ts](../src/lib/inputValidation.ts) is now used by account registration/login, alumni profile APIs, contact, invitation, and event registration. Both donation dialogs now start with terms unchecked and validate donor identity, email, phone, address, PIN, optional PAN, and amount before displaying the existing mock success state. API registration, login, alumni profile, and event registration validate independently of browser constraints.

**Verification is incomplete.** `npx.cmd tsc --noEmit` passed. Targeted ESLint completed with 20 errors and 15 warnings in the selected files; reported errors include existing `any` annotations, JSX apostrophe escaping, and raw anchor usage. Playwright form tests were authored but not executed because no local app listener was available on ports 3000/3101 and no `.env` file was present. No production build or database write test was run. Do not interpret this report as evidence that every form passed runtime testing.

## Inventory and observed validation

| Form / fields | Required / expected rules | Existing validation and status |
|---|---|---|
| `/register` account registration: full name, email, password, confirmation, terms | Name up to 200 chars; email up to 254; password at least 10 chars and at most 72 UTF-8 bytes; exact confirmation; terms opt-in | Client checks all fields; registration API repeats name/email/password checks, canonicalizes email, and checks uniqueness. Terms default unchecked. Playwright negative password case added, not run. |
| `/login` and `LoginForm` email/password | Email syntax; password required and passed unchanged | Active page is `/login`; `LoginForm` is a separate component with no usage found in source search. Login API validates email and required password. UI runtime unverified. |
| `/invite` profile wizard: name, email, phone, DOB, gender, location, bio, LinkedIn, degree, department, batch, institute, company, title, work location, experience, skills, achievements, verification inputs | Required personal/education fields; Unicode names; normalized email; phone syntax; valid past DOB; constrained enums; length and integer bounds; LinkedIn URL | Client-side validation across steps and final submit. Alumni profile APIs independently validate type, length, year, experience, date, enum, URL and list shapes. Full backend happy path not tested because it writes to DB. |
| `AddAlumniModal`: name, email, phone, degree, graduation year, company, role, location, skills, bio | Name/email required; optional phone; year and field lengths aligned to profile schema | UI has basic required fields; target alumni endpoint now validates profile input. Modal/browser workflow unverified. |
| `/api-tester`: name, email, phone, year, location, company, role, skills, bio | Name/email required; profile constraints | UI has basic name/email check; same alumni API validation applies. Tool page was catalogued; not submitted to avoid database writes. |
| `/contact`: full name, email, optional phone, department, optional batch year, category, subject, message, send-copy | Name/email required; phone format if supplied; four-digit graduation year if supplied; subject 1–150 chars; message 15–3000 chars | Client checks and field-level error messages; values remain in state after an error. Submission is a 1.2-second mock and does not dispatch email/store a contact record. Negative and mock-positive Playwright cases added, not run. |
| `/events/register`: first/last name, email, phone, graduation year, department, company/designation, guest count, special requirements, terms | Unicode names up to 100; valid email/phone/year; department required; guest count 0–3 in UI; special text max 1000; terms required | Client checks all listed fields and validates localStorage shape. UI saves only the event title to localStorage. The separate API validates event ID, names, email, phone, year, department, guest count 0–20, requirements and explicit consent before DB access. No UI/API integration or persistence was verified. |
| `/donation` donor dialog: amount/custom amount, name, email, phone, PAN, address, area, city, state, PIN, payment controls, terms | Amount >0, at most 8 integer digits and 2 decimals; valid name/email/phone; optional PAN format; required address fields; six-digit PIN; explicit terms | Added validation before the existing mock success state; terms now default unchecked and checkbox is required. UI does not charge a card or persist a donation. Payment-detail placeholders are not a real payment workflow. |
| `/donation/campaigns` donor dialog: amount/custom amount, name, email, phone, optional PAN, address, area, city, state, PIN, UPI/card/bank placeholders, terms | Same donor checks as donation dialog | Same validation/default-consent fix; UI remains a mock and performs no payment or persistence. |
| `/admin` event form: title, date parts, time, type, mode, location, description, tags, image | Required title/date and bounded content; upload/photo URL | HTML required constraints and client checks; API is admin-only but performs partial input coercion/defaulting. The admin database write form was not submitted. |
| `/admin` gallery form: label, category, year, description, image | Required label; four-digit year; category selection; bounded description; image URL/upload | HTML required/client checks; API is admin-only but truncates year and defaults invalid category values. The admin database write form was not submitted. |
| `/admin` news form: title, category, author, date, read time, excerpt, content, featured, image | Required title; date and bounded fields | HTML required/client checks; API is admin-only but silently defaults invalid dates/categories. The admin database write form was not submitted. |
| `/admin` campaign form: title, tag, category, description, target, raised, donor count, days left, image | Required title; numeric amounts/counts should be finite and within business bounds | Client preview mode uses `parseInt(...) || default`, which can silently replace malformed/zero values. No backend persistence is attached; remediation was deferred to avoid changing the preview contract without UI/runtime evidence. |
| Search, filter and newsletter-like inputs on home, events, news, departments, donation/campaign and admin pages | Free-text search; category/year filters; email subscription fields | Not all are `<form>` elements and several have no submit handler or persistence. They do not write records. No standalone complaint form was found; the contact category includes complaint-like/support inquiries. |
| Upload API | Allowed raster formats, matching MIME and extension, actual file signature, request/file size, folder allowlist, admin role | Existing endpoint applies these checks server-side. It was reviewed statically; no authenticated upload was attempted. |

### Accepted input notes

- Names allow Unicode letters/marks, spaces, apostrophes, periods and hyphens; numeric-only and whitespace-only names fail.
- Email is trimmed, lowercased where it is stored or used for lookup, limited to 254 characters, and checked for a basic address structure. Database uniqueness remains the final duplicate guard.
- Phone validation accepts 10-digit numbers, `+91` followed by 10 digits, or a formatted international number; it does not silently truncate. Formatting separators are accepted and storage remains textual.
- Passwords are not trimmed. Registration enforces a 10-character minimum and bcrypt's 72-byte maximum.
- Date-only validation checks calendar validity and disallows future DOBs. Graduation year is a four-digit value from 1900 through 2100.
- User text allows ordinary punctuation/Unicode while rejecting configured control characters and enforcing field lengths.
- Safe image/profile URL validation accepts HTTP(S) and root-relative paths; the upload endpoint validates image bytes, not only the browser MIME claim.

## Defects and remediation evidence

| Finding | Before | Change | Compatibility / remaining limitation |
|---|---|---|---|
| Client and API validation rules were inconsistent across authentication/profile/event paths | Some endpoints accepted malformed names, email, phone, dates, and numeric fields without independent validation | Shared field validators; server checks added to registration/login, public and department alumni creation, and event registration. See `src/lib/inputValidation.ts` and the affected route files. | Keeps table/column names and payload contracts. API integration tests remain unexecuted. |
| Donation dialogs pre-accepted terms and allowed invalid phone/PAN/address/PIN/amount to reach a mock success state | `useState(true)` for consent; `handleDonate` checked terms only | Consent now defaults false; submit validates all donor fields and positive amount before success. | These are still mock flows and do not collect/charge payment or persist a donation. PAN validation may require business confirmation if non-Indian donors are supported. |
| Event-registration dialog and API have different behavior | UI stored only an event title locally and did not call `/api/events/register`; API had no full payload validation | UI-side checks added; API now independently validates direct requests. | Deliberately did not wire API: UI does not currently carry a stable numeric event ID and connecting it changes persistence behavior. User-facing success remains local-only. |
| Admin content APIs may coerce malformed fields/default invalid values | Observed in event/news/gallery POST handlers and campaign preview | Documented as unresolved; no code change due the existing schema/UI compatibility uncertainty and untested authenticated DB write paths. | Admin write APIs need a separate non-production test database and focused CRUD compatibility suite. Validate POST and PUT consistently before claiming coverage. |

### Before/after evidence

- Account signup previously had only local checks and the API did not enforce the same name/email semantics. The API now returns `400` before obtaining a DB client for malformed name/email/password input; uniqueness conflicts remain `409`.
- Profile API paths previously passed unchecked body values into data creation. They now return `400` for malformed object shapes and invalid profile fields before `createMember` is called.
- Event-registration API previously inserted fields with minimal/no validation. It now validates required identity, event ID, year, guest count, text limits and consent before constructing the parameterized insert.
- Donation consent previously initialized as accepted. It now initializes false in both dialogs and the submit handler validates donor content before showing the existing confirmation.

### Source evidence locations

- Shared validators: [inputValidation.ts](../src/lib/inputValidation.ts#L4) (name/email/phone), [inputValidation.ts](../src/lib/inputValidation.ts#L36) (year/numbers/dates/text), and [inputValidation.ts](../src/lib/inputValidation.ts#L98) (profile payload).
- API checks: [registration](../src/app/api/auth/register/route.ts#L8), [login](../src/app/api/auth/login/route.ts#L8), [alumni create](../src/app/api/alumni/route.ts#L112), [department alumni create](../src/app/api/departments/%5Bslug%5D/alumni/route.ts#L109), and [event registration](../src/app/api/events/register/route.ts#L7).
- Client checks: [registration](../src/app/register/page.tsx#L52), [contact](../src/app/contact/page.tsx#L133), [event registration](../src/app/events/register/page.tsx#L29), [donation](../src/app/donation/page.tsx#L120), and [campaign donation](../src/app/donation/campaigns/page.tsx#L281).
- Automated cases: [form-validation.spec.ts](../tests/security/form-validation.spec.ts#L1).
- Upload review: [upload route](../src/app/api/upload/route.ts#L14).

## Test execution and results

| Check | Result | Evidence / limitation |
|---|---|---|
| `npx.cmd tsc --noEmit` | **PASS** | Completed with exit code 0 after the final code edits. |
| Targeted ESLint on changed validation-related source/spec files | **FAIL / pre-existing issues present** | 20 errors and 15 warnings. Errors reported are `any` usage, unescaped JSX apostrophes, and raw anchor navigation in the selected files; none are in `inputValidation.ts` or `form-validation.spec.ts`. |
| Playwright form-validation test file | **NOT RUN** | Seven tests authored in `tests/security/form-validation.spec.ts`. No listener was running on 3000/3101; `.env` is absent. Existing `.next` and historical Playwright output were preserved instead of starting a process/build that could rewrite them. |
| Relevant functional regression suite | **NOT RUN** | Requires the local application and browser runtime; no production accounts/data used. |
| Production build | **NOT RUN** | Would regenerate `.next`; no build baseline suitable for safely replacing the current artifact was available. |
| Database-backed valid submission / duplicate checks | **NOT RUN** | No database connection was opened. Valid create/update flows were not exercised to avoid writing records. |
| Upload test | **STATIC REVIEW ONLY** | No authenticated admin session or file write was used. Existing server code validates extension/MIME/signature/size/folder. |

The report intentionally does not label unexecuted cases as passed. No production database, account or records were used.

## Outstanding issues and manual follow-up

1. Run the authored Playwright tests against an isolated, non-production app/database and add safe valid-flow tests for each persisted endpoint.
2. Wire event registration UI to its API only after confirming the event ID and expected persistence/confirmation behavior; currently it is a local-only mock.
3. Add server-side field validation to admin events/news/gallery create and update endpoints; cover invalid date/category/length/numeric boundaries and test successful writes against a disposable DB.
4. Decide whether donation forms are intended to remain prototypes or become payment flows. If they become real, use a payment provider and avoid handling raw card data in this app.
5. Reconcile targeted ESLint errors with the project baseline; errors outside the new helper/spec remain unresolved.
6. Run a safe build and regression browser suite when a stable local environment is available.

## Changed files

Validation helper/API/UI changes are in `src/lib/inputValidation.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/alumni/route.ts`, `src/app/api/departments/[slug]/alumni/route.ts`, `src/app/api/events/register/route.ts`, `src/app/register/page.tsx`, `src/app/login/page.tsx`, `src/app/contact/page.tsx`, `src/app/invite/page.tsx`, `src/app/events/register/page.tsx`, `src/app/donation/page.tsx`, `src/app/donation/campaigns/page.tsx`, and `tests/security/form-validation.spec.ts`. The two report documents are separate from application source. All pre-existing worktree changes were preserved.

## Name and mobile verification update (2026-11-18)

This update supersedes the phone-format and Playwright execution statements above for the fields/routes listed here.

- Name controls now filter numeric and unsupported characters during input using Unicode-aware filtering, preserving letters, combining marks, spaces, apostrophes, periods and hyphens. Applied to registration, contact, invite, event registration, alumni modal/API tester, and donation forms.
- Indian mobile controls retain ASCII digits only, cap input at ten, and show/return validation errors unless exactly ten digits are present. Applied to contact, invite, event registration, alumni modal/API tester, and donation forms. The API validator is also used by account registration when an optional phone is supplied, alumni profile creation, and event registration.
- TypeScript passed after the changes. Targeted ESLint on affected sources reported 22 errors and 14 warnings (existing `any` annotations and unused imports among them).
- The expanded Playwright suite contains 11 tests and was actually attempted with output directed to `test-results/name-mobile-verification`. **All 11 failed before exercising assertions** because `127.0.0.1:3101` refused the browser/API connection. No app/API request reached the server. There is no listener on ports 3000/3101, no portal tab, and no `.env`; therefore frontend behavior and backend HTTP responses remain runtime-unverified.
- Static code shows the browser filters and independent API validator described above. This is implementation evidence only, not a runtime pass. Existing `.next` artifacts were not overwritten, and no database was accessed.

Updated affected files include `src/lib/inputValidation.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/alumni/route.ts`, `src/app/api/departments/[slug]/alumni/route.ts`, `src/app/api/events/register/route.ts`, `src/app/register/page.tsx`, `src/app/contact/page.tsx`, `src/app/invite/page.tsx`, `src/app/events/register/page.tsx`, both donation pages, `src/app/api-tester/page.tsx`, `src/components/AddAlumniModal.tsx`, and `tests/security/form-validation.spec.ts`.

### Final mobile boundary test update

The mobile input sanitizer deliberately keeps every digit after removing alphabetic/special characters; it does not truncate overflow. This allows the submit validator to clearly reject 9 or 11+ digits instead of silently converting an invalid value into a valid one. The latest full run contains 14 tests: **3 helper tests passed** (Unicode/name filtering, non-digit mobile filtering with a valid ten-digit value, and rejection of an overlong value); **11 UI/API tests failed at connection/navigation** because port 3101 was unavailable. Final output is [name-mobile-verification-final](../test-results/name-mobile-verification-final). The rendered input and backend HTTP assertions remain runtime-unverified.

### Final live application run superseding earlier attempts

An isolated Next.js dev server was started on `127.0.0.1:3101` with a separate temporary build directory so the existing `.next` was preserved. The full Playwright suite then **passed all 14 tests**: sanitizer behavior, visible name/mobile input filtering, rejection of an overlong mobile number in the invite form, field-level validation feedback, and direct malformed API responses. The API cases returned the expected `400` validation responses before any persistence; no valid record submission was made. Evidence: [name-mobile-live-final](../test-results/name-mobile-live-final). The temporary server was stopped and its build directory removed; the pre-existing `next.config.ts` and `tsconfig.json` state was restored.
