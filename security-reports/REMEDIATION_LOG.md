# Remediation Log

## Baseline preserved

Before editing, the workspace contained numerous uncommitted source changes, archives, a security patch, and prior backup artifacts. Those changes were inspected and preserved. No reset, checkout, deletion, package installation, database migration, production credential change, or external access was performed. Edits were limited to the current application, tests, configuration, and newly created report files.

## Implementation order and changes

### 1. Server-side sessions and authorization

- Added `src/lib/auth.ts`: HMAC-SHA256 session token, timing-safe signature verification, 8-hour expiry, HttpOnly/SameSite cookie, production `Secure` flag, active-user database lookup, current-role check, and origin helper.
- Added `src/app/api/auth/logout/route.ts` to expire the session cookie.
- Updated login to create a session after bcrypt verification, apply generic errors and account/IP throttles, and remove legacy direct admin credentials (that bypass had already been removed in a pre-existing workspace diff).
- Updated `/api/auth/me`, admin UI, login UI, header, and home/register guards to consult the session API rather than browser role flags or email headers.
- Removed fake admin headers from the admin page’s helper; browser fetch sends its same-origin cookie automatically.

### 2. Protected mutation routes

- Added current-admin checks and origin checks to event/news/gallery creation and image upload.
- Retained checks for event/news/gallery update/delete and alumni verification/delete, replacing the insecure original helper semantics.
- Kept public event registration and alumni invite/registration workflows, adding rate limits and restricting anonymous alumni submissions to pending status.
- Removed anonymous duplicate-email profile updates from `createMember` call paths; admin duplicate handling remains in the API route.

### 3. Verification and privacy

- Registration creates `email_verified=false`; associated members are `verified=false` and marked for admin approval.
- Invite page text now describes submission/review rather than claiming email/OTP delivery or verified status.
- Public alumni routes return verified records only and suppress email, phone, date of birth, gender, and user IDs. `/api/auth/me` uses the signed session for self/admin access.
- `src/lib/alumniStore.ts` redacts contact and sensitive demographic fields before localStorage persistence, including when migrating its existing cache.

### 4. Abuse, uploads, errors, and configuration

- Added `src/lib/rateLimit.ts`, a bounded process-local fixed window keyed by a hash of action/address/identity.
- Uploads now require admin, enforce size/rate constraints, match extension/MIME/signature, use UUID filenames, and write with exclusive-create semantics.
- API clients receive generic errors; server logs avoid raw query/error details. Production database calls fail closed if no explicit connection configuration is supplied.
- The SQL seed now provisions an inactive placeholder instead of a default-password admin. No live database was changed.
- Added CSP restrictions and production-only HSTS; kept existing UI-compatible resource policies.
- Added `.env.example`, ESLint flat configuration, and a targeted Playwright security configuration/specs. No package was installed.

### 5. Functional and final verification

- Added `playwright.functional.config.ts` to run the existing functional suite on a dedicated local port and write artifacts under `test-results/functional-remediation`, leaving the pre-existing evidence folders untouched.
- Updated existing functional API expectations for the new 10-character password rule, session-required `/api/auth/me`, and admin-only upload. The existing API cases remain read-only or invalid-input checks.
- Added malformed and tampered signed-cookie cases to `tests/security/authorization.spec.ts`.
- Added `security-reports/FUNCTIONAL_TEST_REPORT.md` and `security-reports/DEPLOYMENT_READINESS_CHECKLIST.md`; updated the audit, register, remediation, and retesting reports with the final counts and blockers.
- Final local results: security suite 6/6, browser suite 20/20, non-DB API subset 6/6, TypeScript check passed, targeted lint passed, production build passed with lint skipped. Full API suite had 7 DB-dependent failures; full lint has 111 errors and 56 warnings.

## Files changed by this remediation

`.env.example`; `Main Database.sql`; `eslint.config.mjs`; `next.config.ts`; `package.json`; `playwright.security.config.ts`; `src/lib/auth.ts`; `src/lib/rateLimit.ts`; `src/lib/db.ts`; `src/lib/alumniStore.ts`; `src/app/admin/page.tsx`; `src/app/invite/page.tsx`; `src/app/login/page.tsx`; `src/app/page.tsx`; `src/app/register/page.tsx`; `src/components/Header.tsx`; `src/components/LoginForm.tsx`; auth login/register/me/logout routes; alumni list/detail and department alumni/detail routes; event list/detail/registration routes; gallery list/detail routes; news list/detail routes; upload and health routes; and `tests/security/authorization.spec.ts`, `tests/security/public-pages.spec.ts`.

The functional suite directory and its existing tests were pre-existing untracked user work; only the three API expectations above were adjusted for the new security behavior. Existing workspace modifications to other files (including the CodeQL workflow and the member detail page) were not changed by this remediation.

## Compatibility and migrations

- No schema migration is required for signed stateless sessions.
- Registration behavior intentionally changes: submissions are pending and not publicly listed until admin approval. There is no email/SMS sender in the project, so actual token/OTP verification was not invented.
- The seed SQL change affects only databases created by rerunning that script. It was not applied to any database.
- Existing deployments need a credential review/rotation and an administrator provisioning procedure. This requires the system owner and was not attempted.
- Production deployments must configure `AUTH_SECRET` (at least 32 random bytes) and an explicit PostgreSQL connection. Development uses a process-local random session secret when `AUTH_SECRET` is absent.

## Outstanding operational work

Use shared rate-limit storage for a multi-instance deployment; configure a trusted reverse proxy to canonicalize client IP headers; verify database grants and network restrictions; provision/rotate administrator credentials; decide whether to add a real email/SMS verification service; and run current registry/Semgrep/CodeQL checks in an approved connected environment. Full upload decoding remains an improvement opportunity if a supported image decoder is approved and made a declared dependency.
