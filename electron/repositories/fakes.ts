import { merge } from '@shared/merge';
import { emptyConfig } from '@shared/types';
import { createFakeClientLogger } from '@electron/services/logger/createFakeLogger';
import { fakeMenuBarRepository } from './menuBar/fake';
import { fakeShell } from './shell/fakeShell';
import { fakeSlackRepository } from './slack/fake';
import { fakeStoreRepoFactory } from './store/fakeStore';
import type { Repositories, RepositoryOverrides } from '.';
import { metaRepo } from './meta';

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
      ...createFakeClientLogger(),
      ...metaRepo,
    },
    overrides
  );
