# Alumni Portal – Functional Testing Strategy

## Objective
Verify that implemented Alumni Portal functions behave according to the API and page behavior visible in the supplied source archive.

## Scope
- API health and database health response
- Authentication request validation (missing email/password, invalid email, short password)
- Current-user endpoint required parameter
- Alumni, events, news and gallery read/list endpoints
- Unknown department handling and department alumni listing
- Upload request validation when no file is supplied
- Browser route rendering for the routes present in the source
- Login and registration field availability
- Members search field interaction, if a search field is exposed

## Out of scope for the initial safe run
Successful registration/login, creating alumni/events/news/gallery records, event registration, file upload, donation/payment transactions, destructive updates/deletes, and security penetration testing. These require approved test data and explicit execution planning.

## Test approach
API tests and browser tests are separate Playwright projects. Browser tests run in visible Chromium, one worker at a time. API tests use Playwright's request fixture. Screenshots, video and traces are retained on failure; the HTML report is generated after execution.

## Entry criteria
1. Dependencies installed in the project.
2. Local PostgreSQL service and the project's own `.env.local` configured.
3. App starts at `http://localhost:3000`.
4. Test package copied into the project without replacing root UI test files/configuration.

## Exit criteria
All planned tests have an execution status, failures are investigated, and evidence is retained. A test is not marked passed unless it has actually executed successfully.

## Known limitations
The source archive does not include `.env.local` or the database SQL file. Database-dependent API tests may fail if the local database is unavailable or its schema/data differs from source expectations.
