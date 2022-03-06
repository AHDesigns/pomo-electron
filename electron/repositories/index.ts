import { emptyConfig, ILogger, UserConfig } from '@shared/types';
import { Menubar } from 'menubar';
import { menuBarRepository, MenuBarRepository } from './menuBar';
import { shellRepository, ShellRepository } from './shell';
import { slackRepository, SlackRepository } from './slack';
import { storeRepository, StoreRepository } from './store';

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
