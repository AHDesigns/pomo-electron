// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 30000,
  globalTimeout: 600000,
  testDir: './e2e',
  outputDir: './reports/playwright-helpers',
  reporter: [ ['html', { open: 'on-failure', outputFolder: './reports/playwright-report'}]]
};
export default config;
