import { _electron as electron, ElectronApplication } from 'playwright';
import { test, expect, Page } from '@playwright/test';

test('main screen', async () => {
  const { window, electronApp } = await start();

  // await window.screenshot({ path: 'intro.png' });
  expect(await window.screenshot()).toMatchSnapshot();

  const logs: string[] = [];

  window.on('console', (msg) => logs.push(msg.text()));

  await window.click('data-test-id=start-button');

  expect(logs).toContain('set tray icon active');

  await window.click('data-test-id=stop-button');

  expect(logs).toContain('set tray icon inactive');

  await electronApp.close();
});

test('settings screen', async () => {
  const { window, electronApp } = await start();

  // navigate to settings
  await window.click('text=settings');

  // let animation complete
  await delay(500);

  expect(await window.screenshot({ fullPage: true })).toMatchSnapshot();

  await electronApp.close();
});

test('slack screen', async () => {
  const { window, electronApp } = await start();

  // navigate to settings
  await window.click('text=settings');

  // activate slack settings
  await window.click('text=slack settings');

  await delay(500);

  expect(await window.screenshot({ fullPage: true })).toMatchSnapshot();

  await electronApp.close();
});

test('theme changes', async () => {
  const { window, electronApp } = await start();

  // navigate to settings
  await window.click('text=settings');

  // activate slack settings
  await window.click('text=theme settings');

  await window.selectOption('select#theme-selector', 'nord-light');

  await delay(500);

  expect(await window.screenshot({ fullPage: true })).toMatchSnapshot();

  await electronApp.close();
});

async function delay(milliseconds: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res(undefined);
    }, milliseconds);
  });
}

async function start(): Promise<{ window: Page; electronApp: ElectronApplication }> {
  // relative to root
  const electronApp = await electron.launch({ args: ['./build/main.js'] });

  // This runs in Electron's main process, parameter here is always
  // the result of the require('electron') in the main app script.
  const isPackaged = await electronApp.evaluate(async ({ app }) => app.isPackaged);

  expect(isPackaged).toBe(false);

  // Wait for the first BrowserWindow to open
  // and return its Page object
  const window = await electronApp.firstWindow();

  expect(window.locator('#App-loaded')).toBeTruthy();

  return {
    window,
    electronApp,
  };
}
