// playwright.config.ts
import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  timeout: 30000,
  globalTimeout: 600000,
  reporter: 'list',
  testDir: './e2e',
};
export default config;
