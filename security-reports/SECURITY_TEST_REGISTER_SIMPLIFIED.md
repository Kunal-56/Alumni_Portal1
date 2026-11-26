# Alumni Portal Security — Simplified Test Register

**Source:** `security-reports/` folder only (VULNERABILITY_REGISTER, SECURITY_AUDIT_REPORT, RETESTING_REPORT, DATABASE_VULNERABILITY_REGISTER, FORM_VALIDATION_TEST_CASES, REMEDIATION_LOG).  
**Scope:** Local workspace at `D:\Alumni_Portal1`. No production host, database, or records used.  
**Style:** Short, standard, formal rule per test case — same pattern as mobile validation cases (001 = limit, 002 = numeric only, 003 = symbols blocked).

---

## Summary (from folder reports)

| Area | Result |
|---|---|
| Application findings (SEC-01..SEC-11) | 11 total: 3 FIXED AND VERIFIED, 8 PARTIALLY MITIGATED, 0 NOT FIXED |
| Database findings (DB-01..DB-08) | 8 total: 2 FIXED AND VERIFIED (static), 2 PARTIALLY MITIGATED, 1 NOT FIXED, 3 NOT VERIFIED |
| TypeScript `tsc --noEmit` | PASS |
| Security Playwright suite | PASS 6/6 |
| Browser functional suite | PASS 20/20 |
| Safe API validation subset | PASS 6/6 |
| Full lint `npm run lint` | FAIL — 111 errors / 56 warnings (pre-existing, not from new files) |
| Production build | Compiles; lint blocked |
| Database integration | NOT RUN — no PostgreSQL available |

---

## Test cases

### 1. Authentication & sessions (SEC-01, SEC-03)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-001 | Only an HMAC-signed session cookie proves identity | Send `x-role=admin` header only | 403 | PASS |
| TC-002 | Bearer strings are not trusted as admin proof | Send `Authorization: Bearer attacker` | 403 | PASS |
| TC-003 | Malformed or tampered session cookie rejected | Send `tolani_session=not-a-valid-signed-session` | 401 | PASS |
| TC-004 | Caller-supplied email is not self-identity without session | Send `x-user-email=admin@tolani.ac.in`, no session | 401 | PASS |
| TC-005 | Protected routes require a signed session + active DB role | Call `/api/auth/me` without cookie | 401 | PASS |
| TC-006 | Logout clears the HttpOnly session cookie | Call `/api/auth/logout` | `Set-Cookie` with `Max-Age=0`, `HttpOnly` | PASS |

### 2. Administrative authorization (SEC-02)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-007 | Content/write routes require a current admin session | Forged-header POST/PUT/PATCH/DELETE on events/news/gallery/alumni | 403 | PASS |
| TC-008 | Image upload requires admin session | POST `/api/upload` without auth | 403 | PASS |

### 3. Registration & verification (SEC-04)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-009 | New accounts are not pre-verified | Register a new user | `email_verified=false` | PASS (static) |
| TC-010 | New alumni profiles are pending approval | Submit public alumni invite | `verified=false`, `admin_approval` | PASS (static) |
| TC-011 | Password minimum length enforced | Register with a 9-character password | 400, reject | PASS |
| TC-012 | Password byte cap enforced | Register with password >72 UTF-8 bytes | 400, reject | PASS |

### 4. Seeded administrator credential (SEC-05)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-013 | SQL seed creates no active default-password admin | Review `Main Database.sql` seed | Disabled placeholder, no known password | PASS (static) |

### 5. Privacy & personal data (SEC-06)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-014 | Public directory returns verified members only | Call public alumni API | Pending/unverified members excluded | PASS |
| TC-015 | Public responses suppress contact fields | Read a public member profile | Email, phone, DOB, gender, user ID removed/masked | PASS |
| TC-016 | localStorage cache redacts private fields | Read cached alumni data | Email, phone, DOB, gender blanked | PASS |

### 6. Rate limiting & abuse (SEC-08)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-017 | Login attempts throttled per IP and account | Repeated failed logins | 429 after limit | PASS (static) |
| TC-018 | Registration rate-limited | Repeated registration attempts | 429 after 5/hour | PASS (static) |
| TC-019 | Same generic error for unknown or wrong password | Login with unknown email vs wrong password | Identical 401 message | PASS |

### 7. File upload (SEC-09)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-020 | SVG and script extensions blocked | Upload `.svg`, `.js`, `.html` | 400, reject | PASS (static) |
| TC-021 | File size capped | Upload image >15 MB | 400, reject | PASS (static) |
| TC-022 | Extension, MIME, and signature must match | Rename `.exe` to `.png` with wrong bytes | 400, reject | PASS (static) |
| TC-023 | Upload folder path confined | Request folder `../../etc` | 400, path traversal blocked | PASS |

### 8. Security headers (SEC-11)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-024 | Clickjacking blocked | Read response headers | `X-Frame-Options: DENY` | PASS |
| TC-025 | MIME sniffing blocked | Read response headers | `X-Content-Type-Options: nosniff` | PASS |
| TC-026 | Framing and objects restricted | Read CSP header | `frame-ancestors 'none'`, `object-src 'none'` | PASS |

### 9. Error disclosure (SEC-10)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-032 | Clients receive generic errors only | Trigger an API failure | No raw SQL/exception text in response | PASS |

### 10. Database (DB-01..DB-08)

| ID | Rule (formal) | Test input / action | Expected | Status |
|---|---|---|---|---|
| TC-023 | Verification request must have an owner | Insert row with `user_id=NULL, member_id=NULL` | Rejected by CHECK constraint | PASS (static) |
| TC-024 | Attempts cannot be negative | Insert `attempts=-1` | Rejected by `CHECK (attempts >= 0)` | PASS (static) |
| TC-025 | Child FK columns indexed | Check indexes on `member_skills.skill_id`, `events.created_by`, etc. | B-tree indexes present | PASS (static) |
| TC-026 | Consent must be explicit, not default-true | Check `event_registrations.agreed_to_terms` default | Default remains `true` — not fixed | NOT FIXED |
| TC-027 | Public directory view must not leak PII | Direct SELECT on `v_member_directory` | Private fields still visible via direct SQL | NOT VERIFIED |
| TC-028 | Database uses least-privilege roles | Inspect roles/grants in `Main Database.sql` | No roles/grants defined | NOT VERIFIED |
| TC-029 | Sensitive donation/audit PII not encrypted | Check `donations.donor_pan`, `audit_log.metadata` | No column encryption defined | NOT VERIFIED |

---

## How to read the status

- **PASS** — Checked in the folder reports and/or confirmed by the local security Playwright suite.
- **PASS (static)** — Verified by reading the source/SQL; not run against a live database.
- **NOT FIXED** — Issue remains open (e.g., consent defaults still `true`).
- **NOT VERIFIED** — Control exists but could not be tested because no PostgreSQL/database was available.

## What still needs manual work (from folder reports)


1. Set a high-entropy `AUTH_SECRET` (32+ random bytes) on every production instance.
2. Provision a unique administrator and rotate credentials in any previously seeded database.
3. Configure a trusted reverse proxy to overwrite client-IP headers.
4. Use shared rate-limit storage for multi-instance deployments.
5. Verify database grants, network restrictions, and least-privilege roles.
6. Decide whether to add real email/SMS verification.
7. Run dependency/Semgrep/CodeQL scans in an approved connected environment.
8. Do not apply the seed SQL to a live database without a reviewed migration/backup plan.
