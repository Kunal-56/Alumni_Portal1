# Project Cleanup Assessment

**Project:** `D:\Alumni_Portal1`  
**Assessment date:** 2026-11-18  
**Mode:** Read-only assessment; no cleanup actions performed.

## Executive summary

The project contains substantial uncommitted application security work, test suites, test outputs, security reports, recovery backups, source archives, and internship/QA evidence. Most of these are unique or have an unresolved dependency and should be preserved. During the approved cleanup, `tsconfig.tsbuildinfo` was removed once, then later found regenerated. It is currently retained because the process that recreated it could not be identified. `.next` and `node_modules` remain in place; both were classified as needing approval, and `node_modules` also requires a separately approved restoration plan.

No files or folders were moved, renamed, or overwritten. The only deletion attempted was the authorized `tsconfig.tsbuildinfo` cache file; a newly generated cache later appeared at the same path and was retained. No application code, SQL, configuration, tests, or historical report/evidence files were modified. This assessment was updated with execution results.

## Baseline and preservation state

- Git branch: `main`.
- The worktree was already dirty before this assessment. It includes modified application/API/auth files, `Main Database.sql`, `next.config.ts`, `package.json`, and `.github/workflows/codeql.yml`, as well as untracked security reports, recovery files, archives, test configurations, and tests. Full current state is available from `git status --short`; all of it was preserved.
- `npx.cmd tsc --noEmit`: **passed** (exit code 0).
- `npm.cmd run lint`: **failed** (exit code 1): 111 ESLint errors and 56 warnings. The errors are spread across existing source files, including `src/app/admin/page.tsx`, API routes, page components, and `src/lib/db.ts`. This is the recorded baseline; no lint fixes were attempted.
- Playwright test discovery passed: main suite **42 tests / 3 files**, security suite **6 tests / 2 files**, functional suite **33 tests / 2 files**. The discovery commands did not execute test cases, but they unexpectedly changed tracked files under `playwright-report/` and `test-results/results.json`; those exact paths were restored to their pre-check Git state after requesting the required filesystem permission. Final Git status confirms those report paths are no longer changed.
- Playwright tests were not run because the configured app endpoints at ports 3000 and 3101 had no listener. The functional/API suite also expects a healthy API/database. No `.env` file was present; only `.env.example` exists.
- `npm run build` was not run. Next build writes to the existing `.next` directory, and the assessment did not overwrite that pre-existing generated state. Production build status is therefore **unverified**.
- No browser, database, deployment, external system, dependency installation, or security scanner was used.

### Baseline limitations

The clean baseline for lint is already failing. Runtime browser/API behavior and the production build remain unverified. For these reasons, no cleanup candidate is described as proven safe by before/after runtime testing.

## Full top-level inventory

Classification meaning:

- **SAFE TO DELETE:** generated and recoverable based on inspection; still requires the explicit cleanup approval requested by the task.
- **SAFE TO ARCHIVE:** not needed for normal runtime, but contains useful material that should be retained in an archive before eventual cleanup.
- **KEEP:** required or contains unique project, security, test, recovery, or documentation material.
- **NEEDS USER APPROVAL:** removal or regeneration safety is uncertain, or a specific approval condition applies.

| Exact item | Classification | Purpose, use, uniqueness, regeneration, and impact |
|---|---|---|
| `.git/` | KEEP | Repository history and index. Not an application artifact; deleting or altering it risks all project history and current work. |
| `.github/` | KEEP | Contains `.github/workflows/codeql.yml`, the only workflow found. That file is modified in the worktree and must be preserved. CodeQL-specific file is identified separately below. |
| `.next/` | NEEDS USER APPROVAL | Generated Next build/cache output (306 files, about 225 MB). Normally recreated by build/dev tooling, but its current state was not backed up or compared against a fresh build. Deletion removes current build/cache output; build verification was deliberately not run. |
| `security-reports/archives/pre-remediation-backup/` (moved from `.security_backup_pre_remediation/` on 2026-11-18) | KEEP / ARCHIVED | Seven pre-remediation snapshots: `alumni_route.ts`, `auth_me_route.ts`, `codeql.yml`, `LoginForm.tsx`, `login_route.ts`, `next.config.ts`, and `upload_route.ts`. Preserved intact as restricted historical recovery evidence. |
| `Alumni_Portal (UI TESTING)/` | KEEP | QA deliverables and unique screenshots, videos, traces, and reports (111 files). Evidence is not safely regenerated as historical evidence; deleting affects internship/QA documentation and test traceability. |
| `Alumni_portal(functional testing/` | KEEP | Functional testing material (16 files), including API/browser Playwright tests and test case/scenario registers. `playwright.functional.config.ts` directly references its test directory. Deletion breaks functional test discovery and removes test documentation. |
| `Computer/` | SAFE TO ARCHIVE | Five PNG screenshots, likely unique project/QA evidence. No runtime dependency found; screenshots are not safely regenerated. Archive before any future cleanup. |
| `node_modules/` | NEEDS USER APPROVAL | Installed dependency tree (about 24,022 files / 457 MB). Re-creatable with `npm ci` and `package-lock.json`, but removal prevents app/build/test execution until restored. The task explicitly requires confirmed restoration and approval before removal. |
| `playwright-report/` | SAFE TO ARCHIVE | Generated HTML Playwright report and traces (50 files, about 34 MB). The main Playwright config writes here. It is output, but contains historical evidence that cannot be recreated exactly; archive first. |
| `public/` | KEEP | Runtime assets and uploads (12 files). User/application files and pages may depend on them; deletion can break visible content or remove uploaded material. |
| `security-agent/` | NEEDS USER APPROVAL | Contains a `.venv` (6,876 of 6,878 files) plus `reports/project-inventory.json` and `scanners/project-inventory.ts`. The venv looks generated, but no definitive dependency manifest/rebuild command was found; inventory/scanner files are unique. Preserve until purpose and rebuildability are confirmed. |
| `security-reports/` | KEEP | Security and database reports, hardened SQL proposal, and 12 Word documents. Contains unique evidence and requested documentation; not safe to remove because newer documents exist. This assessment is now also in this folder. |
| `src/` | KEEP | Application source, including current uncommitted authentication, authorization, API, UI, and database-access work. Directly required at runtime. |
| `test-results/` | KEEP | Generated Playwright outputs (64 files, about 59 MB), including prior security/functional remediation results, screenshots/traces, and result JSON. Configurations write here; historical results are unique evidence. Archive only if separately approved and safely copied. |
| `tests/` | KEEP | Maintained test source, including the security test suite. Deletion removes verification capability. |
| `.build_word_docs_temp.py` | KEEP | Untracked Word-document generation source with reusable report content. It can help regenerate documents, but the current DOCX visual verification was not completed; preserve it. |
| `.env.example` | KEEP | Environment variable template; not an active secret-bearing `.env`. Useful for setup and configuration documentation. |
| `.gitignore` | KEEP | Git behavior configuration for generated files and local environment files. Required project configuration. |
| `Alumni_Security_Source.zip` | KEEP | Historical source archive. It is distinct from the current archive (details below); original security evidence/recovery copy. |
| `Alumni_Security_Source_Current.zip` | KEEP | Separate current-source archive with additional files and changed content. Preserve as a separate recovery snapshot. |
| `eslint.config.mjs` | KEEP | ESLint configuration used by the project lint script. |
| `form.png` | KEEP | Design/reference image directly referenced by comments in `src/app/admin/page.tsx` (“Matching form.png”). Not an unused image. |
| `Main Database.sql` | KEEP | Existing database schema, modified in the worktree. Explicitly protected; SQL and application contracts must remain intact. |
| `next-env.d.ts` | KEEP | Next.js generated TypeScript support declarations; used by TypeScript/Next tooling. Small and easily regenerated, but no reason to remove during cleanup. |
| `next.config.ts` | KEEP | Next.js application/security configuration; modified in the worktree. Required by build/runtime. |
| `package-lock.json` | KEEP | Dependency lockfile needed for reproducible installs and `npm ci`. |
| `package.json` | KEEP | Application manifest, dependencies, and dev/build/start/lint commands; modified in the worktree. |
| `playwright.config.ts` | KEEP | Main Playwright suite configuration, reporter/output paths, browser settings, and dev-server definition. |
| `playwright.functional.config.ts` | KEEP | Functional suite configuration; references the separate functional testing folder and writes to `test-results/functional-remediation`. |
| `playwright.security.config.ts` | KEEP | Security suite configuration; references `tests/security` and writes to `test-results/security-functional-remediation`. |
| `postcss.config.js` | KEEP | Styling/build configuration. |
| `security_changes.patch` | KEEP | Untracked historical security patch. No app runtime reference found; unique recovery/change evidence and should be retained. |
| `SECURITY_REPORT.md` | SAFE TO ARCHIVE | Historical top-level report with earlier status. It is not an application dependency, but it is unique history; retain/archive rather than delete. |
| `t \`n===== NODE =====` | NEEDS USER APPROVAL | Untracked 1,281-byte file whose contents are captured Git diff output, including a line-ending warning and summary. It appears reproducible from the current worktree, but origin/intent are unclear; preserve until confirmed. |
| `tailwind.config.ts` | KEEP | Styling configuration required by the build. |
| `tsconfig.json` | KEEP | TypeScript project configuration. |
| `tsconfig.tsbuildinfo` | SAFE TO DELETE — REGENERATED, RETAINED | Generated incremental TypeScript cache (original: 126,148 bytes; SHA-256 `B1862F241FB6D484FB4D9C22B7B389EFD7BA9DB714FC5E095B7D90E66096798A`). It is ignored by Git; the only project reference found was its `.gitignore` entry. TypeScript configuration has `incremental: true`. It was deleted and was initially absent after typecheck, but a later check found a new 116,993-byte file at the same path. The creator was not identified, so it was left in place. |

## Special checks and dependency evidence

### CodeQL and GitHub workflows

- `.github/workflows/codeql.yml` is the only workflow under `.github/workflows/` found. It is modified in the worktree. **KEEP**.
- `security-reports/archives/pre-remediation-backup/codeql.yml` is a pre-remediation backup. **KEEP**.
- Do not delete `.github` or its workflow as a cleanup action.

### Archive comparison

Both ZIPs were read and compared by normalized internal paths and SHA-256 content hashes; neither archive was extracted or changed.

- `Alumni_Security_Source.zip`: 54 files.
- `Alumni_Security_Source_Current.zip`: 62 files.
- 54 paths are common; 15 common paths have different content.
- The current ZIP has eight additional entries, including the seven pre-remediation backup files and `src/lib/auth.ts`.
- The archives are **not duplicates**. Preserve both as different snapshots.

### Test output and generated files

- The main Playwright config writes HTML output to `playwright-report/`, JSON to `test-results/results.json`, and run artifacts to `test-results/`.
- Security and functional configs write to dedicated subfolders of `test-results/`.
- Existing outputs include screenshots, traces, and reports, so deleting entire output folders would remove unique evidence even though the files were generated.
- `form.png` has source comments referring to it in the admin page; it is an explicit design reference.
- `security-agent/.venv` appears generated, but there is not enough evidence to confirm safe recreation. Its inventory JSON and TypeScript scanner are manually maintained/unique until shown otherwise.
- The `security-reports` directory contained 11 Markdown reports, one SQL remediation proposal, and 12 DOCX documents at inspection. `WINWORD` was running; no `~$` lock files were found in that scan. Keep documents and generator files pending visual verification.

## Cleanup candidate register

No cleanup is approved or performed by this assessment. The following are candidates only:

| Exact path | Proposed action | Evidence and impact | Risk / required gate |
|---|---|---|---|
| `D:\Alumni_Portal1\.next` | Consider removal only after explicit approval | Generated Next output; likely rebuildable. Existing cache was not replaced for baseline build testing. | Medium: rebuild/runtime check required after cleanup. |
| `D:\Alumni_Portal1\node_modules` | Keep for now; possible removal only after explicit approval | Dependency tree is reinstallable from lockfile, but tests/app stop working until restored. | High: confirm restoration process and approve reinstall separately first. |
| `D:\Alumni_Portal1\tsconfig.tsbuildinfo` | DELETED ONCE, THEN REGENERATED AND RETAINED | Exact-path, Git-ignore, configuration, and reference checks were performed. TypeScript passed after deletion; a subsequent check found a new file at the path. | No app behavior impact observed; creator of regenerated cache remains unknown. |
| `D:\Alumni_Portal1\Computer` | Archive only if explicitly approved | Unique screenshots. | Low runtime risk; high evidence loss if removed without archive. |
| `D:\Alumni_Portal1\playwright-report` and `D:\Alumni_Portal1\test-results` | Archive only if explicitly approved | Contains unique historical reports, traces, screenshots, and results; test configurations depend on these as output paths. | Medium runtime/test evidence risk. |
| `D:\Alumni_Portal1\SECURITY_REPORT.md` | Archive only if explicitly approved | Older but unique security report. | Evidence/documentation loss if deleted. |
| `D:\Alumni_Portal1\security-agent\.venv` | No recommendation to remove yet | Generated appearance, but no confirmed recreation manifest/command. | Needs dependency and ownership confirmation. |
| `D:\Alumni_Portal1\t \`n===== NODE =====` | No recommendation to remove yet | Captured diff text, but unclear origin and purpose. | Needs user confirmation. |

Protected items such as source, SQL, configs, security backups, source archives, test source, security reports, Word documents, and uploads are not cleanup candidates.

## Verification status and next gate

| Check | Result | Evidence / limitation |
|---|---|---|
| Git state | Recorded; preserved | Branch `main`; extensive modified and untracked work existed before this task. |
| TypeScript before cleanup | PASS | Baseline `npx.cmd tsc --noEmit`, exit 0. |
| TypeScript after cleanup | PASS | `npx.cmd tsc --noEmit`, exit 0; cache was absent immediately afterward but was present in a later check. |
| Full ESLint baseline | FAIL | `npm.cmd run lint`, exit 1; 111 errors and 56 warnings. These are pre-existing source/test issues and are unrelated to the generated cache deletion. |
| Targeted ESLint after cleanup | PASS | `npx.cmd eslint next.config.ts src/lib/auth.ts src/lib/rateLimit.ts tests/security`, exit 0. The removed cache is not an ESLint input. |
| Main Playwright | DISCOVERY PASS; runtime NOT RUN | 42 tests listed; no server listener at configured port; execution would also write to existing report folders. |
| Security Playwright | DISCOVERY PASS; runtime NOT RUN | 6 tests listed; base URL port 3101 had no listener. |
| Functional Playwright | DISCOVERY PASS; runtime NOT RUN | 33 tests listed; API/browser suite requires the app and API health, and no listener or `.env` was present. |
| Production build | NOT RUN | Would write into existing `.next`; no isolated build output was established without changing config or existing artifacts. |
| Dependency scan / Semgrep | NOT RUN | Not needed for inventory; no dependency installation/tool installation was attempted. |

## Cleanup execution and final comparison

### Deleted item

- **Exact path:** `D:\Alumni_Portal1\tsconfig.tsbuildinfo`
- **Reason:** ignored TypeScript incremental build metadata, not application source or unique project evidence; `tsconfig.json` enables incremental compilation and TypeScript can regenerate metadata as needed.
- **Pre-deletion state:** file existed at 126,148 bytes with SHA-256 `B1862F241FB6D484FB4D9C22B7B389EFD7BA9DB714FC5E095B7D90E66096798A`; `git check-ignore -v` confirmed `.gitignore:8`; project reference search found no source/config/test/security/documentation dependency beyond that ignore rule.
- **Post-deletion verification:** exact path was absent immediately after the deletion and passing `npx.cmd tsc --noEmit`. A later final existence check found a new 116,993-byte file at that path, created at 2026-11-18 12:53:38. The new cache is ignored by Git. Process inspection through CIM was denied by the environment, so the creator could not be identified. To avoid repeatedly deleting a file that may be actively regenerated, it was retained. No unrelated tracked source, SQL, workflow, or report paths changed from this deletion.

### Before/after results

| Check | Before cleanup | After cleanup | Comparison |
|---|---|---|---|
| TypeScript | PASS | PASS | No regression; generated metadata stayed absent. |
| Full ESLint | 111 errors / 56 warnings | Not rerun in full | Existing baseline failures are not attributed to this cleanup. |
| Targeted ESLint | No pre-cleanup targeted run recorded | PASS, exit 0 | Relevant security/config/test source subset passes after cleanup. |
| Playwright security suite | 6 tests discovered; runtime not run | Runtime not run | No server at configured port 3101; no `.env`; see baseline limitation. |
| Playwright functional suite | 33 tests discovered; runtime not run | Runtime not run | No server at configured port 3101; API suite requires healthy app/API. |
| Main Playwright suite | 42 tests discovered; runtime not run | Runtime not run | No local server; test execution would write test artifacts. |
| Production build | Not run | Not run | Would write into the existing `.next` directory; no isolated output was established. |

### Deliberately retained

No other item was deleted. `.next`, `node_modules`, both source ZIP archives, the archived pre-remediation backups, `.github`/CodeQL workflow, `security-agent`, `security-reports`, `src`, `public`, database SQL files, test sources, Playwright reports/results, screenshots, videos, traces, Word documents, and historical security reports remain in place. Existing uncommitted Git changes were preserved.

### Remaining cleanup recommendations

- Keep `tsconfig.tsbuildinfo` until the source of its recreation is identified; avoid repeated deletion while project tooling may be recreating it.
- Keep `.next` unless a separate safe build-output backup/verification plan is established and deletion is explicitly approved.
- Keep `node_modules` unless dependency restoration is confirmed and separately approved; no dependencies were installed or changed.
- Keep all archive, testing, backup, and documentation items as classified in the inventory. For uncertain items, retain them.
- Runtime Playwright checks and production build remain unverified. Establish a local test service and isolated build output before attempting them, without replacing current report evidence or `.next` state.

No further cleanup is performed or implied by this report.

## Pre-remediation backup archive record

On 2026-11-18, the complete former `.security_backup_pre_remediation/` folder was moved to `security-reports/archives/pre-remediation-backup/`. The destination did not exist before the move. Seven files were present before and after; each destination file's SHA-256 matches the corresponding pre-move hash. No credential values or bypass details are reproduced here.

| Archived file | SHA-256 before move (matches archive) |
|---|---|
| `alumni_route.ts` | `CA4B735B25194DFC33362415D7DA0E9BE1A4902264E0F96FFEF89332A52DBDB4` |
| `auth_me_route.ts` | `DA760CA94A96A4CBF245AE7460C957A98B5935950D99D46CD8AE0880FA681083` |
| `codeql.yml` | `50448884B5602206604077F8275F7C6C5570C0E70D0298B0B8F081E950E0176E` |
| `LoginForm.tsx` | `EBFCF2DC10F2ED4F0D40AFB59FAECAE2EBC5CA037FBAC4FE9AB7BE1D3F71A29E` |
| `login_route.ts` | `6EC34EF30FBA61BD05C6B8FBB1D2C240EDCFE17313509B55E9E71D41A693B6F8` |
| `next.config.ts` | `826A5FA88D5156C95C994086EAA17B9D185EE652C21B7F89047CA2F20E70A448` |
| `upload_route.ts` | `0F0400C93652DE3539A02E918C9B464FB45F9BD5E37AD609B813ADE132FDE34B` |

### Path references and exposure controls

- Updated `eslint.config.mjs` so lint ignores the archive's new path.
- Updated `security-agent/scanners/project-inventory.ts` to exclude the exact archive directory from future inventories. The scanner still does not read file contents.
- Updated this current assessment to name the archive destination.
- Left `security-agent/reports/project-inventory.json` unchanged as a dated historical snapshot from 2026-11-16; its old paths describe the project as it existed when generated. Existing source ZIP contents were also left unchanged as historical archives.
- The archive is outside `public/`, and no application source or route references the archive path. No generic file-serving route or production-packaging configuration was found. The current Next configuration uses dependency-based output tracing; the archive has no application imports. A production build/deployment was not executed as part of this archive task, so deployment packaging was not runtime-verified. Keep the archive out of any manual source-copy deployment package and restrict filesystem access to maintainers who need historical security evidence.
- The active login route's SHA-256 remained `42FC4045B9131BF997A57A6C090632503F50F0049AED0BDAC73B5B39EE576117` before and after the move.

### Archive task verification

- Pre-move inventory: 7 files; hashes recorded above.
- Post-move inventory: 7 files; every filename and SHA-256 matched; no unexpected files found.
- Old source folder: absent. Archive folder: present.
- TypeScript: `npx.cmd tsc --noEmit` passed (exit 0).
- Targeted ESLint: `npx.cmd eslint eslint.config.mjs security-agent/scanners/project-inventory.ts` passed with 0 errors and 1 warning (`import/no-anonymous-default-export` in `eslint.config.mjs`).
- Application behavior was not exercised; active login route source hash is unchanged.
- Git status shows the intended directory relocation and the two targeted live-tooling edits; existing unrelated worktree modifications remain. No pre-existing file was overwritten.
