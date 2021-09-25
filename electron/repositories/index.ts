// eslint-disable-next-line import/no-extraneous-dependencies
import { nativeImage } from 'electron';
import { merge } from '@shared/merge';
import { emptyConfig, UserConfig } from '@shared/types';
import { slackRepository, SlackRepository } from '@electron/repositories/slack';
import { logger } from '@electron/services';
import { Menubar } from 'menubar';
import { ok, Result } from '@shared/Result';
import { asset, isDev } from '@shared/constants';
import { fakeShell, shellRepository, ShellRepository } from './shell';
import { fakeStoreRepoFactory, storeRepository, StoreRepository } from './store';

interface IconRepo {
  setTrayIcon(state: 'active' | 'inactive'): void;
  setTrayTitle(msg: string): void;
  windowFocus(): void;
  count1Second(): Promise<Result<void>>;
}

export type Repositories = IconRepo &
  ShellRepository &
  SlackRepository &
  StoreRepository<UserConfig>;

const trayIcon = nativeImage.createFromPath(asset(`IconTemplate${isDev ? 'Dev' : ''}.png`));
const trayActiveIcon = nativeImage.createFromPath(
  asset(`IconActiveTemplate${isDev ? 'Dev' : ''}.png`)
);

export const productionRepositories = (mb: Menubar): Repositories => ({
  async count1Second() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ok(undefined));
      }, 1000);
    });
  },
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
  ...slackRepository(),
  ...shellRepository,
  ...storeRepository({
    name: 'client',
    defaults: emptyConfig,
  }),
});

export type RepositoryOverrides = Partial<Repositories>;

export const fakeRepositories = (overrides?: RepositoryOverrides): Repositories =>
  merge(
    {
      async count1Second() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(ok(undefined));
          }, 1000);
        });
      },
      windowFocus() {},
      setTrayIcon() {},
      setTrayTitle() {},
      ...slackRepository(),
      ...fakeShell(overrides),
      ...fakeStoreRepoFactory({
        name: 'client',
        defaults: emptyConfig,
      }),
    },
    overrides
  );
