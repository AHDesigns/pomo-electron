import { IpcHandlers } from '@shared/types';
import type { Repositories } from '@electron/repositories';
import { handlerMethods } from '@electron/ipc/handlerMethods';

export function handlers(repos: Repositories): IpcHandlers {
  return Object.keys(handlerMethods).reduce<IpcHandlers>(
    (fns, key) => ({
      ...fns,
      // @ts-expect-error meh
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
      [key]: (_, args) => repos[key](...args),
    }),
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    {} as IpcHandlers
  );
}
