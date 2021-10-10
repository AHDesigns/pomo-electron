import { Menubar } from 'menubar';
import { merge } from '@shared/merge';
import { emptyConfig, UserConfig, ILogger } from '@shared/types';
import { fakeSlackRepository, slackRepository, SlackRepository } from './slack';
import { fakeShell, shellRepository, ShellRepository } from './shell';
import { fakeStoreRepoFactory, storeRepository, StoreRepository } from './store';
import { menuBarRepository, MenuBarRepository, fakeMenuBarRepository } from './menuBar';

export type Repositories = MenuBarRepository &
  ShellRepository &
  SlackRepository &
  StoreRepository<UserConfig>;

interface RepoArgs {
  logger: ILogger;
  mb: Menubar;
}

export const productionRepositories = ({ logger, mb }: RepoArgs): Repositories => ({
  ...slackRepository({ logger }),
  ...shellRepository,
  ...storeRepository({
    storeConfig: {
      name: 'client',
      defaults: emptyConfig,
    },
    logger,
  }),
  ...menuBarRepository({ logger, mb }),
});

export type RepositoryOverrides = Partial<Repositories>;

export const fakeRepositories = (overrides?: RepositoryOverrides): Repositories =>
  merge(
    {
      ...fakeSlackRepository(),
      ...fakeShell(overrides),
      ...fakeStoreRepoFactory({
        name: 'client',
        defaults: emptyConfig,
      }),
      ...fakeMenuBarRepository,
    },
    overrides
  );
