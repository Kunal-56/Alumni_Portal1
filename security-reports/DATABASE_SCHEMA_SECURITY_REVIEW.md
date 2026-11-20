# Database Schema Security Review

**Assessment date:** 2026-11-17  
**Workspace:** `D:\Alumni_Portal1`  
**Review scope:** Static review of the PostgreSQL schema, seed data, views, triggers, indexes, and relevant application queries. No database was connected to and no SQL was executed.

## Executive summary

The primary schema is [Main Database.sql](../Main%20Database.sql), 718 lines. No additional project SQL, DDL, or migration files were found. The original file was not edited during this task. A separate copy with safe additive constraints and foreign-key indexes is [Main_Database_hardened.sql](database-remediation/Main_Database_hardened.sql).

The schema defines 18 tables, 3 views, 3 trigger functions, 13 triggers, and 33 original indexes. All tables have primary keys. The defined foreign keys reference primary/unique keys. No database roles, grants/revokes, row-level security policies, or `SECURITY DEFINER` functions are defined, so effective database permissions cannot be determined from this repository.

Two static corrections were made in the separate schema copy and verified by source comparison: verification requests now require a user or member owner and nonnegative attempt count; five missing indexes were added for foreign-key columns. Eight findings are tracked: 2 fixed and verified statically, 2 partially mitigated with proposals, 1 not fixed, and 3 not verified because permissions/data/runtime state are unavailable. No production-readiness claim is made.

## Scope and method

- Enumerated SQL/schema files and searched application queries against schema object names and columns.
- Reviewed keys, constraints, defaults, FKs/delete actions, sensitive columns, seed credential, indexes, views, PL/pgSQL functions/triggers, and role/privilege declarations.
- Compared the original SQL to the hardened copy, confirming that only the `verification_requests` definition and five added indexes differ.
- Checked for local `psql`, `pg_isready`, `pg_dump`, `sqlfluff`, and `pg_format`; none were available. No `DATABASE_URL` or PostgreSQL environment configuration was present.
- Did not install tooling, connect to any database, inspect production records, or execute a migration.

## Schema inventory

| Object | Count | Notes |
|---|---:|---|
| Tables | 18 | All have a declared primary key. |
| Foreign keys | 16 | Parent references are declared; child indexes were reviewed separately. |
| Views | 3 | `v_member_directory`, `v_upcoming_events`, `v_initiative_progress`. |
| Trigger functions | 3 | Timestamp, department count, donation raised amount. |
| Triggers | 13 | Two aggregate triggers and eleven timestamp triggers. |
| Indexes | 33 | Hardened copy adds five child-side FK indexes (38 total). |
| Roles/grants/RLS | 0 definitions | Runtime privileges depend on how the deployment creates and connects its database user. |

## Findings overview

| ID | Severity | Finding | Status |
|---|---|---|---|
| DB-01 | Medium | Verification requests can be ownerless and have negative attempts | FIXED AND VERIFIED (static) |
| DB-02 | High | Deleting an initiative cascades into donation records | PARTIALLY MITIGATED (migration recommendation only) |
| DB-03 | Medium | Consent columns default to `true`; event API also writes `true` unconditionally | NOT FIXED (requires application and migration decision) |
| DB-04 | High | Member directory view exposes PII and unverified rows if selectable | NOT VERIFIED (effective grants unknown) |
| DB-05 | High | Least-privilege roles/grants are not defined in project SQL | NOT VERIFIED (deployment configuration unavailable) |
| DB-06 | Medium | Linked member/user emails are not constrained to match | PARTIALLY MITIGATED (current registration path matches values) |
| DB-07 | Medium | Donor PAN/address and audit metadata can contain sensitive personal data | NOT VERIFIED (no database/data or privilege inspection) |
| DB-08 | Low | Several FK columns lack supporting indexes | FIXED AND VERIFIED (static) |

Full evidence, SQL excerpts, impact, and compatibility notes are in [DATABASE_VULNERABILITY_REGISTER.md](DATABASE_VULNERABILITY_REGISTER.md).

## Functionality and compatibility

The hardened SQL preserves table and column names, relationships, seed records, views, and triggers. The only new constraints apply to `verification_requests`, which has no current application write path in the reviewed source. The added indexes do not change query results or API contracts. The separate file is a fresh-schema artifact; it was not applied to any existing database.

Potentially behavior-changing changes were not applied: restricting donation-initiative deletion, changing consent defaults, splitting/redacting views, altering privileges, or enforcing linked email equality. Each needs review of existing data and deployment behavior first.

## Remaining limits

Static inspection cannot prove actual grants, table ownership, RLS, installed extensions, existing data quality, index usage, function behavior under the application role, or whether migration DDL is lock-safe on the deployment database. See [DATABASE_RETESTING_REPORT.md](DATABASE_RETESTING_REPORT.md) and [DATABASE_MIGRATION_RECOMMENDATIONS.md](DATABASE_MIGRATION_RECOMMENDATIONS.md).
