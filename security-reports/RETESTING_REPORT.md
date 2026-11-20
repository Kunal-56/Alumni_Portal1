# Security Retesting Report

**Date:** 2026-11-17  
**Target:** Local development server at `127.0.0.1:3101`; no production host or database.

## Automated results

| Check | Result | Evidence / limits |
|---|---|---|
| `npx tsc --noEmit` | Pass | No TypeScript diagnostics after test typing fix. |
| `npx next build --no-lint` | Pass | Production compilation, type check, 29 static pages, route traces. Lint was explicitly skipped. |
| `npm run lint` | Fail | 111 errors, 56 warnings; mainly `no-explicit-any`, JSX text/link rules, unused symbols, and a hook dependency warning across `src` and `tests`. |
| Targeted ESLint | Pass | `auth.ts`, `rateLimit.ts`, logout route, security tests/config, and `next.config.ts` clean. |
| Security Playwright suite | Pass: 6/6 | Forged identities and admin claims, malformed/tampered sessions, cross-origin write, all tested admin write verbs, logout cookie, headers, public routes, password feedback. |
| Browser functional suite | Pass: 20/20 | Main page, login/register/invite, members, events, gallery, news, departments, donation/contact, and form/search checks. |
| Functional API validation subset | Pass: 6/6 | Missing login fields, invalid email/short password, unauthenticated current-user, and unauthenticated upload. |
| Full functional API suite | 6 pass, 7 fail | All seven failures returned 500 on DB-dependent read/health endpoints while PostgreSQL was unavailable. No write tests were run. |
| `npm audit --offline --json` | 0 cached advisories | 440 dependencies counted. Offline mode did not refresh registry data. |
| Semgrep | Not run | Not installed; no tool installation was authorized. |
| CodeQL | Not run | Workflow was not dispatched to an external service. |
| `git diff --check` | Pass | No whitespace errors reported in the recorded remediation check. |

Security suite command: `npx.cmd playwright test --config=playwright.security.config.ts` (6 passed).  
Browser command: `npx.cmd playwright test --config=playwright.functional.config.ts tests/browser/functional-browser.spec.ts` (20 passed).  
API safe subset: `npx.cmd playwright test --config=playwright.functional.config.ts tests/api/functional-api.spec.ts --grep=FT-API-00[2-6]`, plus `--grep=FT-API-013` (6 passed).  
Full read-only API run: `npx.cmd playwright test --config=playwright.functional.config.ts tests/api/functional-api.spec.ts` (6 passed, 7 failed due to unavailable DB).

## Before / after

| Area | Before | After / retest |
|---|---|---|
| Admin identity | Client headers, arbitrary bearer values, and cookie text were trusted | Forged identity and tampered session attempts are rejected; protected routes require a signed session and current DB role |
| Login state | Browser storage represented identity | HMAC-signed expiring HttpOnly cookie; `/api/auth/me` requires it |
| Administrative writes | Content and upload creation lacked trusted authorization | Forged POST/PUT/PATCH/DELETE requests are denied; valid admin DB-backed writes remain unverified |
| Registration | Weak minimum and verified flags | 10-character minimum (72-byte bcrypt cap); accounts and alumni remain unverified/pending |
| Directory privacy | Contact/demographic fields exposed by public API/cache | Code suppresses sensitive fields and pending records; DB-backed response not verified |
| Upload | Public upload and metadata-only checks | Admin-only; bounds, allow-list, signature checks, and unique filenames; upload without auth returned 403 |
| Error messages | Raw exceptions could reach clients/logs | Generic client errors and reduced diagnostic logging in reviewed routes |
| Headers | Basic headers only | CSP restrictions and production HSTS added; local header test passed |

## Remaining verification blockers

- No PostgreSQL connection settings, service, or `psql` tool were present. Valid login, active-admin authorization, registration inserts, member approval, privacy response contents, and database CRUD were not integration-tested. The full API suite's seven failures are the health, alumni, events, news, gallery, unknown-department, and department-alumni DB-dependent cases.
- Existing production administrator state was not inspected; old seeded credentials may persist in an existing database.
- Registry advisory data, Semgrep rules, and hosted CodeQL results were not available.
- Rate limits are process-local. Multi-instance deployments need shared state and a trusted proxy configuration.
- Upload signatures are checked but image bytes are not decoded/re-encoded.
- HSTS was not tested over deployed TLS; CSP remains intentionally limited and does not set a script-src policy.

See [VULNERABILITY_REGISTER.md](VULNERABILITY_REGISTER.md) for the final disposition of all 11 findings.
