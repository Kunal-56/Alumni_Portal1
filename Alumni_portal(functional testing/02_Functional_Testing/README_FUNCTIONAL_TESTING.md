# Alumni Portal Functional Testing Package

This is a separate Playwright functional-testing package. It is designed to sit beside the existing UI-testing setup without changing the existing root Playwright configuration or UI test files.

## Contents
- `Automation/playwright.config.ts` – independent configuration with separate API and visible-browser projects.
- `Automation/tests/api/functional-api.spec.ts` – API validation and read-only checks.
- `Automation/tests/browser/functional-browser.spec.ts` – browser route and form checks.
- `Documentation/` – strategy, source inspection and execution instructions.
- `Evidence/` – destination for generated reports, screenshots, videos, traces and test results.

## Install into project
Extract this folder into `D:\\Alumni_Portal1`. Do not merge its contents into the root `tests` folder.

## Run
Follow `Documentation/Execution_Notes.md`.

## Safety of initial suite
The initial suite does not create accounts, register for events, add alumni/content, upload files, or make payments. These workflows need controlled test data and approval before enabling.
