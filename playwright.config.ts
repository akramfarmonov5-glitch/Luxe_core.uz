import { defineConfig, devices } from '@playwright/test';

/**
 * E2E (Playwright) konfiguratsiyasi.
 *
 * Ishga tushirish:
 *   npx playwright install chromium   # bir marta
 *   npm run test:e2e                  # dev serverni o'zi ko'taradi
 *
 * Boshqa muhitga qarshi:
 *   PLAYWRIGHT_BASE_URL=https://luxe-core.uz npm run test:e2e
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const isRemote = Boolean(process.env.PLAYWRIGHT_BASE_URL);

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Masofaviy URL berilmasa — lokal dev serverni avtomatik ko'taradi.
  webServer: isRemote
    ? undefined
    : {
        command: 'npm run dev',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
