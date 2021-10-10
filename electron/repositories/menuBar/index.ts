import { Menubar } from 'menubar';
import { nativeImage } from '@electron/electron';
import { asset, isDev } from '@shared/constants';
import { ILogger } from '@shared/types';

export interface MenuBarRepository {
  setTrayIcon(state: 'active' | 'inactive'): void;
  setTrayTitle(msg: string): void;
  windowFocus(): void;
}

const trayIcon = nativeImage.createFromPath(asset(`IconTemplate${isDev ? 'Dev' : ''}.png`));
const trayActiveIcon = nativeImage.createFromPath(
  asset(`IconActiveTemplate${isDev ? 'Dev' : ''}.png`)
);

export const menuBarRepository = ({
  mb,
  logger,
}: {
  mb: Menubar;
  logger: ILogger;
}): MenuBarRepository => ({
  windowFocus() {
    mb.showWindow();
  },
  setTrayIcon(state) {
    logger.info('called', state);
    switch (state) {
      case 'active':
        mb.tray.setImage(trayActiveIcon);
        break;
      default:
      case 'inactive':
        mb.tray.setImage(trayIcon);
        break;
    }
  },
  setTrayTitle(msg: string) {
    mb.tray.setTitle(msg);
  },
});

export const fakeMenuBarRepository: MenuBarRepository = {
  windowFocus() {},
  setTrayIcon() {},
  setTrayTitle() {},
};
