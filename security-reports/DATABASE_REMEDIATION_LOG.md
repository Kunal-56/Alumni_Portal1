# Database Remediation Log

**Date:** 2026-11-17  
**Original schema:** [Main Database.sql](../Main%20Database.sql) (preserved; not edited by this task)  
**Separate hardened schema:** [Main_Database_hardened.sql](database-remediation/Main_Database_hardened.sql)

## Baseline and safety

The workspace already contained extensive modified and untracked application/security files. Git status was inspected before work; those changes were preserved. No reset, checkout, cleanup, original-schema edit, package installation, database connection, database operation, migration execution, production access, or credential/permission change occurred.

The schema copy is a complete copy of the current source schema with only two categories of changes: two checks in `verification_requests` and five additive foreign-key indexes. Existing tables, columns, names, defaults, FKs, seed rows, views, functions, and triggers are preserved.

## Implemented corrections

### DB-01 — Verification request integrity

Original `Main Database.sql:289-300` allowed both owner identifiers to be NULL and allowed a negative `attempts` value.

Hardened definition at `Main_Database_hardened.sql:289-303` adds:

```sql
attempts smallint NOT NULL DEFAULT 0 CHECK (attempts >= 0),
CONSTRAINT verification_requests_owner_required
    CHECK (user_id IS NOT NULL OR member_id IS NOT NULL)
```

The checks allow user-owned, member-owned, or jointly owned requests and any nonnegative attempt count. No app code currently writes the table, but the schema change preserves those expected use patterns.

### DB-08 — Missing foreign-key indexes

Added at `Main_Database_hardened.sql:354-358`:

```sql
CREATE INDEX idx_member_skills_skill ON member_skills (skill_id);
CREATE INDEX idx_events_created_by ON events (created_by);
CREATE INDEX idx_gallery_uploaded_by ON gallery_items (uploaded_by);
CREATE INDEX idx_news_created_by ON news_articles (created_by);
CREATE INDEX idx_contact_resolved_by ON contact_inquiries (resolved_by);
```

These support parent-row maintenance and joins. No existing index was removed, including apparent duplicates under unique constraints.

## Proposals prepared, not applied

- DB-02: Replace donation cascade deletion with restriction/soft deletion after approving financial-record retention behavior.
- DB-03: Change consent defaults to false and require explicit consent in all application writers. Application changes were not authorized in this task; current event API writes `true` explicitly.
- DB-04/DB-05: Inspect deployment role and view grants, then split public verified-only directory fields from admin-only PII access and apply least-privilege grants.
- DB-06: Audit linked member/user emails and define synchronization before adding a cross-table integrity trigger.
- DB-07: Review whether PAN/address collection is necessary; prefer a processor reference/token and define audited access/retention. No data was inspected or changed.

Proposals and required compatibility checks are detailed in [DATABASE_MIGRATION_RECOMMENDATIONS.md](DATABASE_MIGRATION_RECOMMENDATIONS.md).
