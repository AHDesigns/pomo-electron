/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { IpcRenderer } from '@electron/electron';
import type { IBridge } from '@shared/types';
import { reBuild } from '@shared/Result';
import { assertUnreachable } from '@shared/asserts';
import { handlerMethods } from './handlerMethods';

export function bridgeCreator(ipcR: IpcRenderer): IBridge {
  const pairs = Object.entries(handlerMethods);

  return pairs.reduce((obj, [key, { renderer }]) => {
    switch (renderer) {
      case 'send':
        return {
          ...obj,
          [key]: (...args: unknown[]) => ipcR.send(key, args),
        };
      case 'invoke':
        return {
          ...obj,
          [key]: async (...args: unknown[]) => reBuild(await ipcR.invoke(key, args)),
        };
      default:
        /* istanbul ignore next */
        return assertUnreachable(renderer);
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  }, {} as IBridge);
}
