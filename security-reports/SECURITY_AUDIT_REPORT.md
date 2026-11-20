# Alumni Portal Security Audit Report

**Assessment date:** 2026-11-17  
**Scope:** Current local workspace at `D:\Alumni_Portal1`  
**Status:** Source remediation implemented; production, database-backed, and external-tool verification remain outstanding.

## Executive summary

The initial review recorded 11 findings. At final retest, 3 meet the report's “fixed and verified” criterion and 8 remain partially mitigated pending database, deployment, or feature work. The partial items include positive database-backed authentication and authorization, actual email/SMS verification, existing administrator credential state, database-backed privacy output, shared rate limiting, image decoding, and production CSP/TLS validation.

No confirmed SQL injection was found in the reviewed database paths. The most serious initial issue was that caller supplied headers, bearer strings, and cookie text could impersonate an administrator. The server now accepts only an HMAC-signed, expiring, HttpOnly session cookie and checks the user’s active state and current role in PostgreSQL on protected requests.

No database was available in this workspace. Valid login, database reads/writes, database permissions, and deployed administrator state could not be retested. Do not treat the passing API guard tests or offline dependency audit as evidence that production is secure.

## Project and architecture

- **Frontend/backend:** Next.js 15 App Router, React 19, TypeScript.
- **Data:** PostgreSQL through `pg`; schema and seed data are in `Main Database.sql`.
- **Authentication:** Email/password checked using bcryptjs. The remediation adds a signed session cookie using Node `crypto`; server-side role checks query the `users` table.
- **Authorization:** Admin mutations require an active database user with the `admin` role. Public alumni submissions remain available as unverified requests for alumni-office review.
- **Files:** Raster image uploads are stored under `public/uploads`; uploads now require an administrator session and pass extension, MIME, size, and file-signature checks.
- **Tests:** Playwright is present. A separate security Playwright config and targeted specs were added. TypeScript is checked with `npx tsc --noEmit`.
- **Dependencies:** `package-lock.json`; no dependency was installed or added.

## Method and tools

Reviewed routes, auth UI, session state, database helpers, SQL schema/seed, security headers, dependency manifest, and existing Git state. Ran `npx tsc --noEmit`, `npx next build --no-lint`, targeted ESLint, a local Playwright security/page suite, `npm audit --offline --json`, and `git diff --check`.

Semgrep was not installed. CodeQL is configured in the existing GitHub workflow but was not run. The offline npm audit returned zero advisories from locally available audit data; registry data was not refreshed. No external systems, production database, or production credentials were accessed.

## Findings summary

| ID | Initial severity | Finding | Current disposition |
|---|---|---|---|
| SEC-01 | Critical | Forged administrator authorization | Fixed and verified for forged claims; valid DB-backed admin session pending integration test |
| SEC-02 | High | Unprotected content and upload writes | Partially mitigated; forged writes denied; positive DB-backed admin workflow pending |
| SEC-03 | High | No server-verifiable login session | Partially mitigated; signed/tampered cookie behavior tested; successful DB login pending |
| SEC-04 | High | Accounts and alumni marked verified without verification | Partially mitigated; records pending/unverified; no email/SMS verification service exists |
| SEC-05 | High | Seeded default administrator credential | Partially mitigated; new seed disabled; existing DB state/rotation unverified |
| SEC-06 | Medium | Public personal-data exposure | Partially mitigated in code/cache; DB-backed response not integration-tested |
| SEC-07 | Medium | Caller supplied email used as self-identity | Fixed and verified; no-session identity request rejected |
| SEC-08 | Medium | Login/registration abuse and email enumeration | Partially mitigated; process-local limits are not shared across instances |
| SEC-09 | Medium | Upload metadata trusted without content checks | Partially mitigated; signature checks added, full image decoding not performed |
| SEC-10 | Low | Internal error messages returned/logged | Fixed and verified by reviewed response/logging paths |
| SEC-11 | Informational | Missing browser security headers | Partially mitigated; CSP is limited and HSTS applies only in production |

**Counts:** 11 original findings; 3 fixed and verified; 8 remaining as partially mitigated; 0 additional confirmed code-level findings from the retest scope. “Remaining” includes findings with implemented controls whose complete positive-path or production verification is outstanding. See [VULNERABILITY_REGISTER.md](VULNERABILITY_REGISTER.md).

## Remediation performed

- Replaced header/cookie-text/bearer authorization with signed sessions, HttpOnly/SameSite cookies, current database role checks, origin checks, and logout cookie expiration.
- Added admin checks to all event/news/gallery mutations and uploads. Restricted member status/delete operations to administrators.
- Kept the invite flow public but made submissions unverified, excluded them from public listings, rate limited submissions, and removed duplicate-email update behavior for anonymous callers.
- Changed account registration to store `email_verified=false` and create pending alumni records. Increased password minimum to 10 characters and capped passwords at bcrypt’s 72 UTF-8 byte limit.
- Replaced the seeded administrator password with a disabled placeholder account.
- Restricted public directory responses to verified profiles and removed email, phone, date of birth, gender, and user IDs from public responses as applicable. Redacted these fields from the local-storage cache.
- Added process-local request limits, upload file signature checks, safer unique filenames, body/file size checks, generic API errors, and production database-configuration requirements.
- Added frame/content/referrer/permissions/CSP headers and production-only HSTS.
- Added `.env.example` documenting `AUTH_SECRET`, and configured a security test suite.

## Modified files

- `.env.example`, `Main Database.sql`, `eslint.config.mjs`, `next.config.ts`, `package.json`, `playwright.security.config.ts`
- `src/lib/auth.ts`, `src/lib/rateLimit.ts`, `src/lib/db.ts`, `src/lib/alumniStore.ts`
- `src/app/admin/page.tsx`, `src/app/invite/page.tsx`, `src/app/login/page.tsx`, `src/app/page.tsx`, `src/app/register/page.tsx`
- `src/components/Header.tsx`, `src/components/LoginForm.tsx`
- `src/app/api/auth/login/route.ts`, `src/app/api/auth/register/route.ts`, `src/app/api/auth/me/route.ts`, `src/app/api/auth/logout/route.ts`
- `src/app/api/alumni/route.ts`, `src/app/api/alumni/[id]/route.ts`, `src/app/api/departments/[slug]/alumni/route.ts`, `src/app/api/departments/[slug]/route.ts`
- `src/app/api/events/route.ts`, `src/app/api/events/[id]/route.ts`, `src/app/api/events/register/route.ts`
- `src/app/api/gallery/route.ts`, `src/app/api/gallery/[id]/route.ts`, `src/app/api/news/route.ts`, `src/app/api/news/[id]/route.ts`, `src/app/api/upload/route.ts`, `src/app/api/health/route.ts`
- `tests/security/authorization.spec.ts`, `tests/security/public-pages.spec.ts`

This list excludes files that were already modified before this remediation and were preserved without additional edits.

## Verification and remaining risks

- TypeScript check passed.
- Production build passed with lint disabled; normal `npm run build` remains blocked by lint errors.
- Security Playwright suite passed 6/6, browser functional suite passed 20/20, and safe API validation/upload cases passed 6/6 against the local development server.
- Full read-only API suite: 6 passed and 7 database-dependent cases failed with HTTP 500 because PostgreSQL was unavailable.
- Targeted ESLint passed for the new auth/rate-limit/logout/test/config files.
- Full ESLint run reports 111 errors and 56 warnings across the application, including explicit-`any`, React hook, and JSX rule violations. The lint issue is documented rather than hidden by disabling rules.
- Offline npm audit returned 0 advisories from cached data only.

Manual actions remain: set a high-entropy `AUTH_SECRET` in every production instance; securely provision a new administrator and rotate credentials in any database that was seeded before this change; configure the reverse proxy to overwrite trusted client-IP headers; use shared rate-limit storage for multiple instances; review database grants and network restrictions; decide whether to add real email/SMS verification; and run current dependency/Semgrep/CodeQL scans in an approved connected environment. Do not apply the seed SQL to a live database without a reviewed migration/backup plan.

See [RETESTING_REPORT.md](RETESTING_REPORT.md), [FUNCTIONAL_TEST_REPORT.md](FUNCTIONAL_TEST_REPORT.md), [DEPLOYMENT_READINESS_CHECKLIST.md](DEPLOYMENT_READINESS_CHECKLIST.md), and [REMEDIATION_LOG.md](REMEDIATION_LOG.md) for test evidence, blockers, and file-level changes.
