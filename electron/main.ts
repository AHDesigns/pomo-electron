// eslint-disable-next-line import/no-extraneous-dependencies
import { globalShortcut, nativeImage } from 'electron';
import { menubar } from 'menubar';
import { asset, isDev, isIntegration } from '@shared/constants';
import url from 'url';
import path from 'path';
import { checkForUpdates, logger, setUpDevtools } from '@electron/services';
import { ipcMain } from '@electron/electron';
import { fakeRepositories, productionRepositories } from '@electron/repositories';
import { handlers, setupIpcHandlers } from '@electron/ipc';

checkForUpdates(logger);

const icon = asset(`IconTemplate${isDev ? 'Dev' : ''}.png`);

const mb = menubar({
  icon,
  index: getPage(),
  preloadWindow: false,
  browserWindow: {
    backgroundColor: '#2E3440',
    height: 300,
    width: 300,
    webPreferences: {
      nodeIntegration: true,
    },
    ...(isDev && { alwaysOnTop: true }),
  },
  showDockIcon: false,
});

const repos = isIntegration ? fakeRepositories() : productionRepositories(mb);
setupIpcHandlers(ipcMain, handlers(repos));

const trayIcon = nativeImage.createFromPath(asset(`IconTemplate${isDev ? 'Dev' : ''}.png`));

mb.on('after-create-window', () => {
  mb.app.dock.hide();
});

mb.on('ready', () => {
  logger.info('app ready');

  mb.tray.setImage(trayIcon);

  setUpDevtools(logger);

  // const menu = Menu.buildFromTemplate([
  //   {
  //     label: 'File',
  //     submenu: [
  //       {
  //         label: 'Quit',
  //         accelerator: 'CommandOrControl+Q',
  //         role: 'quit',
  //       },
  //     ],
  //   },
  // ]);
  // Menu.setApplicationMenu(menu);

  globalShortcut.register('Ctrl+Alt+P', () => {
    // more https://stackoverflow.com/questions/50642126/previous-window-focus-electron if windows and linux don't play ball
    if (mb.window?.isVisible()) {
      mb.hideWindow();
      mb.app.hide();
    } else {
      mb.showWindow();
    }
  });

  // setInterval(() => {
  //   const [width, height] = mb.window?.getContentSize() ?? [0, 0];
  //   mb.window?.setContentSize(width, height > 500 ? 300 : 700, true);
  // }, 3000);
});

mb.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

function getPage(): string {
  return isDev
    ? 'http://localhost:4000'
    : url.format({
        pathname: path.join(__dirname, 'renderer/index.html'),
        protocol: 'file:',
        slashes: true,
      });
}
