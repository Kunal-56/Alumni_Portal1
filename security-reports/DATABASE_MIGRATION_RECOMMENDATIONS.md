# Database Migration Recommendations

No migration was executed. The full hardened file is for a reviewed fresh-schema installation, not for rerunning against an existing database. For existing environments, prepare a separately reviewed incremental migration only after a non-production database and data inventory are available.

## DB-01 — Verification request checks

The fresh schema includes the owner and nonnegative-attempt checks. For an existing database, first check for violations:

```sql
SELECT id, user_id, member_id, attempts
FROM verification_requests
WHERE (user_id IS NULL AND member_id IS NULL) OR attempts < 0;
```

Do not delete or assign owners automatically. Determine the correct account/profile owner, or quarantine rows through the approved process. After cleanup, add and validate the constraints. Since no application consumer currently writes this table, verify the verification workflow contract before enabling it.

## DB-02 — Donation history deletion

The current FK cascades initiative deletion into all associated donations. Preferred options, in order of data-retention safety:

1. Soft-deactivate an initiative with `is_active=false` and retain donation history.
2. Change the FK to `ON DELETE RESTRICT` so history prevents campaign deletion.
3. Permit physical deletion only under an explicit approved retention process; do not cascade-delete donation records as an incidental campaign operation.

Before migration, inventory donation/payment/receipt references and locate all admin workflows that delete campaigns. Changing to `RESTRICT` can make existing deletion actions fail and requires UI/API handling. No deletion was performed.

## DB-03 — Consent data

For a future coordinated schema/application release, consider `DEFAULT false` on `event_registrations.agreed_to_terms` and `donations.agreed_to_terms`, plus explicit server-side validation that a user selected consent. Existing `src/app/api/events/register/route.ts` inserts literal `true`; changing only the database default does not correct that behavior. Do not treat old `true` rows as verified consent without evidence. Do not add a constraint that rejects current legitimate writes until the app is updated and retested.

## DB-04 and DB-05 — View and privilege model

First inspect `pg_roles`, object ownership, `information_schema.role_table_grants`, schema privileges, default privileges, installed RLS policies, PostgreSQL version, and the application connection role in an approved non-production environment. Then design:

- a non-login owner/migration role;
- a separate non-superuser runtime role;
- a public verified-only directory view that omits email, phone, and user IDs;
- administrative access to PII only through least-privilege grants and explicit authorization;
- grants on required sequences and trigger-owned tables/functions without broad `PUBLIC` access.

Do not revoke privileges or enable RLS before the complete application query inventory and trigger behavior are tested. The current app queries sensitive fields from `v_member_directory` for admin use, so a view replacement must preserve that authorized workflow.

## DB-06 — Linked user/member email consistency

Before enforcing consistency, query linked pairs for mismatched normalized emails and document intended email-change behavior. Existing account registration inserts the same email in both rows; a future change can use a carefully designed trigger or transactional procedure that permits the linked pair while preventing mismatch. A simple cross-table unique constraint is incorrect because the intended account/profile pair shares an email.

## DB-07 — Sensitive donor and audit data

Confirm whether any deployed database contains donor PAN, address, or audit metadata, and identify legitimate payment/reporting use. Prefer payment-provider references instead of storing card/PAN-equivalent credentials; minimize and mask personal fields where possible. Set least-privilege access, audit access to sensitive tables, and define retention/erasure policy. Do not drop columns or rewrite rows until application/report dependencies and retention obligations are known.

## DB-08 — Added indexes

The hardened fresh schema adds five FK-supporting indexes. For existing tables, assess row counts, existing equivalent indexes, write load, and lock tolerance first. Prefer `CREATE INDEX CONCURRENTLY` in a separately planned migration where appropriate; it cannot be placed inside the schema's current transaction. Do not execute the regular `CREATE INDEX` statements against a production-sized database without a maintenance/locking plan.

## Preconditions for any migration

- An approved, restorable backup and tested restore procedure.
- A disposable non-production database matching PostgreSQL version/extensions.
- Data-quality queries for every new constraint.
- Application integration tests for login, registration, directory/admin, event registration, donation reporting, and deletion behavior.
- Reviewed execution plan, locking/downtime expectation, rollback strategy, and owner approval.
- Confirmation that no production database or records are targeted.
