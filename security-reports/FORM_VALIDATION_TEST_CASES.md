# Form Validation Test Case Register

**Date:** 2026-11-18  
**Execution environment:** No local app listener was available at `127.0.0.1:3000` or `:3101`; no `.env` was present. No database or production system was contacted. Test cases below are therefore marked **NOT RUN** unless the result explicitly says static inspection or TypeScript compilation.

## Automated Playwright cases

Playwright source: [form-validation.spec.ts](../tests/security/form-validation.spec.ts). It contains seven cases. They avoid valid requests that could write to a database; the positive case is the contact form's existing mock confirmation only.

| Test Case ID | Form and field | Test input category | Expected result | Actual result | Status | Evidence reference |
|---|---|---|---|---|---|---|
| FV-API-001 | Registration API: full name/email/password | Invalid name, malformed email, under-minimum password | HTTP 400 safe validation response before DB client acquisition | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/api/auth/register/route.ts` |
| FV-API-002 | Login API: email | Missing domain / malformed email | HTTP 400 before account lookup | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/api/auth/login/route.ts` |
| FV-API-003 | Alumni create API: name/email/phone | Numeric name, malformed email, alphabetic phone | HTTP 400 before profile persistence | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/api/alumni/route.ts` |
| FV-API-004 | Event registration API: all required fields | Empty JSON object | HTTP 400 with missing/invalid event message before insert | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/api/events/register/route.ts` |
| FV-UI-001 | Registration: password | Six-character password with otherwise plausible data | Visible minimum-length feedback; no API submission | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/register/page.tsx` |
| FV-UI-002 | Contact: email | Malformed address | Visible field error; typed value remains in field | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/contact/page.tsx` |
| FV-UI-003 | Contact: name/email/subject/message | Valid mock inquiry | Existing mock confirmation displays; no actual email/database dispatch | Not run; response not observed | NOT RUN | `form-validation.spec.ts`; `src/app/contact/page.tsx` |

## Field-level boundary and negative test matrix

These cases are the manual/automated coverage required for a complete run. They have not all been encoded or executed. The expected results below derive from the current validator/API rules and documented form behavior; they are not runtime pass claims.

| Test Case ID | Form and field | Test input category | Expected result | Actual result | Status | Evidence reference |
|---|---|---|---|---|---|---|
| FV-NAME-001 | Registration / contact / alumni profile: name | Empty and whitespace-only | Reject as required; show understandable error | Not run | NOT RUN | `inputValidation.ts` `validateFullName` |
| FV-NAME-002 | Name | Unicode letters, spaces, apostrophe, hyphen, period | Accept legitimate name | Not run | NOT RUN | `inputValidation.ts` `NAME_PATTERN` |
| FV-NAME-003 | Name | Digits or unsupported symbols | Reject | Not run | NOT RUN | `inputValidation.ts` `NAME_PATTERN` |
| FV-NAME-004 | Name | Maximum length and one character over | Accept through 200 chars (first/last through 100); reject over | Not run | NOT RUN | `inputValidation.ts`; event API route |
| FV-EMAIL-001 | Account/contact/profile: email | Uppercase and surrounding spaces | Accept and normalize trim/lowercase where stored/looked up | Not run | NOT RUN | `inputValidation.ts` `normalizeEmail` |
| FV-EMAIL-002 | Email | Missing username/domain, embedded whitespace, malformed suffix | Reject | Not run | NOT RUN | `inputValidation.ts` `validateEmail` |
| FV-EMAIL-003 | Email | 254 chars and 255 chars | Accept at limit if syntax valid; reject above | Not run | NOT RUN | `inputValidation.ts` `validateEmail` |
| FV-EMAIL-004 | Registration/profile | Existing email duplicate | Return conflict without duplicate account/profile | Not run; needs isolated database | NOT RUN | Registration unique lookup and DB constraints |
| FV-PHONE-001 | Required phone fields | Empty or whitespace | Reject | Not run | NOT RUN | `inputValidation.ts` `validatePhone` |
| FV-PHONE-002 | Phone | Exactly 10 digits; formatted +91; allowed international number | Accept and preserve as string | Not run | NOT RUN | `inputValidation.ts` `validatePhone` |
| FV-PHONE-003 | Phone | 9 digits, 11 digits, alphabetic, malformed prefix | Reject; do not truncate | Not run | NOT RUN | `inputValidation.ts` `validatePhone` |
| FV-PASS-001 | Registration: password | 9 chars / 10 chars | Reject 9; accept length boundary if other rules pass | Not run | NOT RUN | Registration UI/API |
| FV-PASS-002 | Registration: password | More than 72 UTF-8 bytes, Unicode multi-byte input | Reject above bcrypt byte limit; do not trim/log password | Not run | NOT RUN | `src/app/api/auth/register/route.ts` |
| FV-PASS-003 | Registration: confirmation | Mismatch | Reject with confirmation guidance | Not run | NOT RUN | `src/app/register/page.tsx` |
| FV-NUM-001 | Event/API: event ID, guest count, experience | Negative, decimal, alphabetic, unsafe integer | Reject before DB access | Not run | NOT RUN | `validateIntegerRange`; event and profile APIs |
| FV-NUM-002 | Event UI: guest count | 0, 3, 4, fractional/mutated value | Accept 0–3; reject outside UI range | Not run | NOT RUN | `src/app/events/register/page.tsx` |
| FV-NUM-003 | Donation forms: selected/custom amount | Zero, negative, alphabetic, exponent notation, >8 digits, >2 decimals | Reject; accept positive decimal up to defined limit | Not run | NOT RUN | Donation `handleDonate` handlers |
| FV-YEAR-001 | Contact/profile/event: year | 1900, 2100, outside range, non-4-digit | Accept boundaries; reject out of range/format | Not run | NOT RUN | `validateGraduationYear` |
| FV-DATE-001 | Invitation/profile DOB | Valid past date, impossible date, future date, wrong format | Accept valid past date; reject impossible/future date | Not run | NOT RUN | `validateDateOnly` |
| FV-TEXT-001 | Contact: subject/message | Empty, whitespace-only, message <15 | Reject required/short values with field errors | Not run | NOT RUN | Contact `validate` handler |
| FV-TEXT-002 | Contact/profile/requirements | Maximum allowed length and one over | Accept at limit; reject over without losing other fields | Not run | NOT RUN | Contact maxLength/validators; profile helper |
| FV-TEXT-003 | User text | Unicode and ordinary punctuation | Accept valid text; reject disallowed control characters | Not run | NOT RUN | `validateText` |
| FV-DROP-001 | Event/profile/admin dropdowns and radio options | Missing or manipulated enum value | Reject unsupported direct API selection | Partially assessed; event/profile APIs validate enumerated values where present; admin APIs remain unresolved | NOT RUN | Profile helper; `src/app/api/events/register/route.ts`; admin routes |
| FV-TERMS-001 | Registration/donations/event registration | Consent unchecked or omitted from direct API | Block submit; API requires event consent explicitly | Not run | NOT RUN | Registration/donation UI; event API |
| FV-UPLOAD-001 | Admin image upload | SVG, script extension, MIME mismatch, fake signature | Reject before disk write | Static code indicates checks exist; no authenticated runtime upload performed | NOT RUN | `src/app/api/upload/route.ts` |
| FV-UPLOAD-002 | Admin image upload | File >15 MB / request >16 MB | Reject with size response | Static code indicates checks exist; no runtime upload | NOT RUN | `src/app/api/upload/route.ts` |
| FV-API-001 | Profile/event/register endpoints | Malformed JSON, array, null, unexpected field types | Return safe 400 response before persistence | Negative Playwright test source exists for representative cases; not run | NOT RUN | API routes and `form-validation.spec.ts` |
| FV-API-002 | Admin event/news/gallery create/update | Invalid date, category, title/URL/text lengths, numeric boundaries | Return 400 and avoid DB write | Not comprehensively enforced or tested | NOT RUN | `src/app/api/events/route.ts`, `src/app/api/news/route.ts`, `src/app/api/gallery/route.ts`, corresponding `[id]` routes |
| FV-REG-001 | Existing workflows | Valid signup/login/alumni/event/admin/donation flows | Preserve successful behavior without unexpected writes | Not run; valid DB workflows require isolated test DB; donation/contact remain mock-only | NOT RUN | Functional regression suite required |

## Static verification

| Check ID | Check | Actual result | Status |
|---|---|---|---|
| FV-STATIC-001 | `npx.cmd tsc --noEmit` | Exit code 0 after final edits | PASS |
| FV-STATIC-002 | Targeted ESLint over modified validation files and Playwright spec | 20 errors / 15 warnings in selected files; findings include existing `any`, JSX apostrophe, and anchor issues; helper/spec have no reported lint findings | FAIL (existing issues remain) |
| FV-STATIC-003 | Local app availability | No listener found on ports 3000/3101; `.env` absent | BLOCKED for browser runtime |
| FV-STATIC-004 | Database availability/write testing | No connection attempted; no records written | NOT RUN |

## Release gate

The form validation work is **partially verified**, not complete. Before declaring all forms validated, run the Playwright suite with an isolated local environment, exercise valid and invalid API cases, verify admin create/update flows against a disposable database, and complete the untested boundary matrix above. Preserve no-write tests for endpoints that would create user/account/content records unless a dedicated disposable database is configured.

## Name/mobile verification update (2026-11-18)

This update supersedes the earlier Playwright count/results and generic international phone test expectations above for Indian mobile fields.

The test suite now has 11 cases, including name input filtering, Unicode name preservation, mobile digit filtering/ten-digit cap, and direct invalid-mobile API requests. It was run with output at `../test-results/name-mobile-verification`. **Actual result: 11 failed at navigation or connection setup with `ECONNREFUSED 127.0.0.1:3101`; no form or API assertion ran.** Do not count the planned field-level cases as passing.

Name/mobile implementation was statically reviewed: `sanitizeNameInput` preserves Unicode letters/marks and common name separators while stripping digits and unsupported characters; `sanitizeIndianMobileInput` keeps ASCII digits and slices at ten; `validateIndianMobile` rejects anything other than exactly ten digits. It is wired into the form/API files listed in the report addendum. Runtime behavior and actual HTTP error responses remain NOT VERIFIED until the portal is running locally.

### Final test run superseding the earlier count

The sanitizer does **not** truncate digits beyond ten; it strips non-digits and leaves overflow visible for `validateIndianMobile` to reject. The final full Playwright run executed 14 tests: helper unit cases **3 PASS**; UI/API cases **11 NOT VERIFIED** because all failed to connect to `127.0.0.1:3101`. Evidence is in `test-results/name-mobile-verification-final`. No application assertion or backend response was observed.

### Final live run superseding the connection-failure attempt

With a temporary isolated local Next server active, the complete 14-test Playwright run **passed 14/14**. This includes actual browser input checks for name filtering and mobile cleanup/length errors, plus direct HTTP requests that received the expected 400 responses for malformed registration, login, alumni, and event inputs. No valid persistence request was submitted. Evidence is at `test-results/name-mobile-live-final`; the temporary server and separate build output were stopped and removed after the run.
