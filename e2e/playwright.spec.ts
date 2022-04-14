import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';

test('launch app', async () => {
  // relative to root
  const electronApp = await electron.launch({ args: ['./build/main.js'] });

  // This runs in Electron's main process, parameter here is always
  // the result of the require('electron') in the main app script.
  const isPackaged = await electronApp.evaluate(async ({ app }) => app.isPackaged);

  expect(isPackaged).toBe(false);

  // Wait for the first BrowserWindow to open
  // and return its Page object
  const window = await electronApp.firstWindow();
  // await window.screenshot({ path: 'intro.png' });
  expect(await window.screenshot()).toMatchSnapshot();

  const logs: string[] = [];

  window.on('console', (msg) => logs.push(msg.text()));

  await window.click('text=Start');

  expect(logs).toContain('set tray icon active');

  await window.click('text=Stop');

  expect(logs).toContain('set tray icon inactive');

  await electronApp.close();
});
