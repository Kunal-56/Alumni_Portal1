# Deployment Readiness Checklist

**Assessment date:** 2026-11-17  
**Disposition:** Not ready for production sign-off. Local build and non-DB regression checks pass, while database integration, deployment configuration, and external scans remain incomplete.

## Required before deployment

- [ ] Set a unique, high-entropy `AUTH_SECRET` of at least 32 bytes in every production instance and store it in the approved secret manager.
- [ ] Configure an explicit PostgreSQL connection through the deployment secret system; verify TLS/network policy and least-privilege grants.
- [ ] Provision a new administrator using an approved procedure. Review existing databases for the former seeded credential and rotate or disable it. The revised seed does not alter an already-created database.
- [ ] Run the auth, authorization, privacy, registration, and CRUD integration suites against a disposable non-production PostgreSQL database. The local run could not cover these behaviors.
- [ ] Confirm the deployment proxy overwrites forwarded client IP headers. Use a shared rate-limit store if more than one application instance serves traffic.
- [ ] Verify HTTPS, secure-cookie behavior, HSTS, and proxy/origin behavior in the deployment environment.
- [ ] Review CSP against actual production scripts and third-party resources. Current policy sets `frame-ancestors`, `object-src`, `base-uri`, and `form-action`, but not a complete `script-src` policy.
- [ ] Decide whether real email/SMS verification is required and implement a provider-backed token flow if so. Current registration creates pending, unverified records for admin review.
- [ ] Decide whether approved image decoding/re-encoding is required. Current upload validation checks allow-listed extension, MIME, size, and file signatures but does not decode raster content.
- [ ] Run current online dependency advisory checks and an approved Semgrep/CodeQL scan. The offline audit found no cached advisories only; Semgrep was unavailable and CodeQL was not dispatched.
- [ ] Resolve the repository lint gate (111 errors, 56 warnings) and rerun the normal production build. The build only passed with `--no-lint`.
- [ ] Review the final Git diff, including pre-existing workspace changes, before commit or deployment.

## Verified locally

- [x] TypeScript check passed: `npx.cmd tsc --noEmit`.
- [x] Production compile/type/page generation passed: `npx.cmd next build --no-lint` (lint skipped explicitly).
- [x] Security Playwright suite passed: 6/6.
- [x] Browser functional route suite passed: 20/20.
- [x] Non-DB functional API validation/upload subset passed: 6/6.
- [x] Targeted ESLint passed for auth/session/rate-limit/logout/security specs/config and `next.config.ts`.
- [x] Local response included configured CSP, X-Frame-Options, and X-Content-Type-Options headers.
- [x] Offline npm audit returned 0 cached advisories across 440 dependencies; this is not a current registry clearance.

## Open risk summary

The application must not be represented as production-secure based on these local results alone. The unverified areas include valid database-backed login/admin access, live user and credential state, database authorization/grants, private-field output under real data, multi-instance rate limiting, production TLS/header behavior, and current dependency/static-analysis findings. See [VULNERABILITY_REGISTER.md](VULNERABILITY_REGISTER.md) and [RETESTING_REPORT.md](RETESTING_REPORT.md).
