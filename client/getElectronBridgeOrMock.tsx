/* eslint-disable no-console */
import { fakeRepositories } from '@electron/repositories/fakes';
import { IBridge } from '@shared/types';

export function getElectronBridgeOrMock(): IBridge {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  if (window.bridge as unknown) return window.bridge;

  return {
    ...fakeRepositories(),
    openExternal: async (url) => {
      window.open(url);
      return Promise.resolve();
    },
  };
}
