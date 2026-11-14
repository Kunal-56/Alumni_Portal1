
import { test, expect } from '@playwright/test';

test('Homepage should load successfully', async ({ page }, testInfo) => {
    const errors: string[] = [];

    page.on('pageerror', error => {
        errors.push(error.message);
    });

    console.log('STEP 1: Opening Alumni Portal homepage');

    const response = await page.goto('http://localhost:3000/');

    console.log('STEP 2: Checking HTTP response');

    expect(response?.status()).toBeLessThan(400);

    console.log('STEP 3: Checking page visibility');

    await expect(page.locator('body')).toBeVisible();

    console.log('STEP 4: Capturing homepage screenshot');

    await page.screenshot({
        path: testInfo.outputPath('homepage.png'),
        fullPage: true,
    });

    console.log('STEP 5: Checking JavaScript errors');

    expect(errors).toEqual([]);

    console.log('HOMEPAGE TEST COMPLETED');
});
