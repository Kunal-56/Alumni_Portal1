# Source Inspection Notes

## Input inspected
`Alumni_Functional_Source.zip` uploaded in this conversation.

## Technology and structure observed
- Next.js App Router application using TypeScript and React.
- PostgreSQL access module: `src/lib/db.ts`.
- Playwright dependency is present in `package.json`.
- Existing UI tests are in `tests/alumni-portal-ui.spec.ts` and `tests/homepage.completed.ts`.
- Existing root `playwright.config.ts` belongs to the pre-existing UI setup and must remain unchanged.

## API route files observed
- `/api/health`
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/me`
- `/api/alumni` and `/api/alumni/[id]`
- `/api/departments/[slug]`
- `/api/departments/[slug]/alumni`
- `/api/events`, `/api/events/[id]`, `/api/events/register`
- `/api/news`, `/api/news/[id]`
- `/api/gallery`, `/api/gallery/[id]`
- `/api/upload`

## Functional scope selected for the initial suite
Read-only listing and health checks, validation-only authentication requests, unknown-department handling, missing-file upload validation, and browser route/form availability checks.

## Important execution constraints
- `.env.local` and database credentials were not included in the ZIP. Do not place secrets in this package or reports.
- The tests must be run against the user's configured local app and database.
- No data-creating test (successful registration, event registration, content creation, alumni insertion, upload) is enabled in this initial suite.
- The source archive contains the existing UI test files; this package does not alter them.
- Test assertions describe expected API contracts inferred from source. Execution results must be reported separately and must never be pre-filled as passed.
