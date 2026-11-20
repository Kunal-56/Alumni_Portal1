# Database Retesting Report

**Date:** 2026-11-17  
**Method:** Static source checks only. No live PostgreSQL runtime was available or contacted.

## Static checks performed

| Check | Result | Evidence / limitation |
|---|---|---|
| Original schema location | Pass | `Main Database.sql`, 718 lines; no other project SQL/DDL/migration file found. |
| Hardened copy scope | Pass | Text comparison after removing the changed table and added index block confirms remaining schema text matches the original copy. |
| Object inventory parity | Pass | Both schemas preserve the same 18 table names, 3 view names, 3 trigger function names, and 13 trigger names. |
| Verification request correction | Pass (static) | Hardened definition contains owner-required and `attempts >= 0` checks; original does not. |
| FK index additions | Pass (static) | Five intended indexes appear once in the hardened copy; index count 33 → 38. |
| Application column compatibility | Pass (inspection only) | Registration writes columns present in `users`/`members`; member skills/achievements/audit inserts match defined objects; event registration column names match table definition. No query was executed. |
| PostgreSQL syntax parse | Not run | `psql`, `pg_format`, and `sqlfluff` unavailable; no installation performed. |
| PostgreSQL runtime/catalog/data checks | Not run | No `DATABASE_URL`, `PGHOST`, `PGUSER`, or `PGDATABASE` was configured; no database service/tool available. |
| Migration execution | Not run | No SQL was executed against any database. |

## Before / after evidence

| Object | Original | Hardened copy | Verification |
|---|---|---|---|
| `verification_requests.attempts` | `smallint NOT NULL DEFAULT 0` | `smallint NOT NULL DEFAULT 0 CHECK (attempts >= 0)` | Static presence check passed. |
| Verification request owner | Both `user_id` and `member_id` nullable, no table-level owner check | `CHECK (user_id IS NOT NULL OR member_id IS NOT NULL)` | Static presence check passed. |
| FK child indexes | 33 indexes total; five listed FK columns not indexed | Five additional B-tree indexes, 38 total | Static uniqueness/count check passed. |
| Donation deletion behavior | `donations.initiative_id ... ON DELETE CASCADE` | Preserved pending compatibility review | No data-affecting change was made. |
| Consent defaults | `agreed_to_terms DEFAULT true` | Preserved pending app/owner decision | Existing API write path explicitly inserts true; schema-only change is insufficient. |
| Directory view and DB privileges | PII/unverified rows in view; grants absent from project schema | Preserved pending deployment privilege inspection | Cannot validate access or RLS without database catalog/role. |

## Limits and next test stage

Static checks verify text and object-contract consistency only. They do not prove the hardened file parses on the target PostgreSQL version, that the extension privileges exist, that constraints fit existing rows, or that indexes are useful under real query plans.

Before any deployment, restore the hardened schema into a disposable non-production database, run catalog checks and representative app read/write tests, inspect current data for constraint violations, and review migration locks. Do not run the fresh-install SQL against an existing database. See [DATABASE_MIGRATION_RECOMMENDATIONS.md](DATABASE_MIGRATION_RECOMMENDATIONS.md).
