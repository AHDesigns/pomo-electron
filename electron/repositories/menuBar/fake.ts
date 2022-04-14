import type { MenuBarRepository } from '.';

export const fakeMenuBarRepository: MenuBarRepository = {
  windowFocus() {},
  setTrayIcon(state) {
    // eslint-disable-next-line no-console
    console.log(`set tray icon ${state}`);
  },
  setTrayTitle() {},
};
