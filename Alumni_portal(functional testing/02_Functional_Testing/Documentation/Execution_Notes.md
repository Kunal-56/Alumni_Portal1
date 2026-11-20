# Execution Notes

Run commands from the project root (`D:\\Alumni_Portal1`) in PowerShell.

## Install / verify
```powershell
npm install
npx playwright --version
```

## Start the app
Terminal 1:
```powershell
cd D:\\Alumni_Portal1
npm run dev
```
Wait until Next.js reports that it is ready at `http://localhost:3000`.

## Run API functional tests (separate)
Terminal 2:
```powershell
cd D:\\Alumni_Portal1
npx playwright test --config ".\\Alumni_Portal_Functional_Testing_Package\\Automation\\playwright.config.ts" --project=functional-api
```

## Run visible browser functional tests (separate)
```powershell
npx playwright test --config ".\\Alumni_Portal_Functional_Testing_Package\\Automation\\playwright.config.ts" --project=functional-browser
```

## Open HTML report
```powershell
npx playwright show-report ".\\Alumni_Portal_Functional_Testing_Package\\Evidence\\HTML_Report"
```

## Important
- Do not close the app terminal while tests are running.
- The browser project opens visible Chromium and executes sequentially.
- The initial suite avoids successful data-creating actions.
- Do not edit or overwrite the root `playwright.config.ts` or existing UI tests.
- The report is created only after actual test execution; no results are pre-populated.
