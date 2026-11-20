# Functional Test Report

**Date:** 2026-11-17  
**Target:** Local Next.js development server at `127.0.0.1:3101`  
**Safety:** Existing functional suites were read-only or validation-only. No database writes were attempted.

## Results

| Suite | Result | Scope |
|---|---:|---|
| Browser route suite | 20 passed, 0 failed | Home, login, registration, invite, members, events, gallery, news, contact, donations, departments, and form/search affordances |
| API validation subset | 6 passed, 0 failed | Missing credentials, invalid email, weak password, unauthenticated user lookup, and unauthenticated upload |
| Full API suite | 6 passed, 7 failed | Seven read/health cases require PostgreSQL; the local workspace has no configured database |
| Security regression suite | 6 passed, 0 failed | Forged identity/session, protected writes, origin, logout, headers, public pages, password policy |

## Commands

```text
npx.cmd playwright test --config=playwright.functional.config.ts tests/browser/functional-browser.spec.ts
npx.cmd playwright test --config=playwright.functional.config.ts tests/api/functional-api.spec.ts --grep=FT-API-00[2-6]
npx.cmd playwright test --config=playwright.functional.config.ts tests/api/functional-api.spec.ts --grep=FT-API-013
npx.cmd playwright test --config=playwright.functional.config.ts tests/api/functional-api.spec.ts
npx.cmd playwright test --config=playwright.security.config.ts
```

The functional config in the repository root points to the existing suite under `Alumni_portal(functional testing/02_Functional_Testing/Automation/tests` and writes Playwright artifacts to `test-results/functional-remediation`, preserving the existing evidence/report directories.

## API cases blocked by database availability

The following existing read-only tests returned HTTP 500 where the tests expect normal DB-backed results:

- FT-API-001 health check
- FT-API-007 alumni list
- FT-API-008 events list
- FT-API-009 news list
- FT-API-010 gallery list
- FT-API-011 unknown department
- FT-API-012 department alumni list

These results identify missing local DB integration, not successful verification of the respective database behavior. No DB connection, credentials, or service were available. Configure an authorized non-production PostgreSQL test database and rerun these cases before release. Do not use production data for this test suite.

## Compatibility adjustment

The existing API functional assertions were updated to match the remediation: registration now requires at least 10 characters, `/api/auth/me` returns 401 without a signed session, and upload returns 403 without an administrator session. No broad UI expectations were removed.

The 20 browser route and interaction checks passed without changing the existing UI flows.
