import { emptyConfig, IClientLogger, ILogger, UserConfig } from '@shared/types';
import { Menubar } from 'menubar';
import { menuBarRepository, MenuBarRepository } from './menuBar';
import { shellRepository, ShellRepository } from './shell';
import { slackRepository, SlackRepository } from './slack';
import { storeRepository, StoreRepository } from './store';
import { metaRepo, MetaRepo } from './meta';

export type Repositories = IClientLogger &
  MenuBarRepository &
  MetaRepo &
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
      migrations: {
        '>=0.4.2': (store) => {
          store.set('theme', 'nord');
        },
      },
    },
    logger,
  }),
  ...menuBarRepository({ logger, mb }),
  ...logger,
  ...metaRepo,
});

export type RepositoryOverrides = Partial<Repositories>;
