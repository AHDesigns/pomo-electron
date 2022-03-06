// eslint-disable-next-line import/no-extraneous-dependencies
import type { IpcMain } from 'electron';
import type { IpcHandlers } from '@shared/types';
import { Result, strip } from '@shared/Result';
import { handlerMethods } from '@electron/ipc/handlerMethods';

export function setupIpcHandlers(ipcMain: IpcMain, loadedHandlers: IpcHandlers): void {
  Object.entries(handlerMethods).forEach(([key, { main }]) => {
    switch (main) {
      case 'handle':
        ipcMain.handle(key, async (event, args) => {
          // @ts-expect-error meg
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
          const result: Result<unknown> = await loadedHandlers[key](event, args);
          return strip(result);
        });
        break;
      case 'on':
        ipcMain.on(key, (event, args) => {
          // @ts-expect-error meg
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          loadedHandlers[key](event, args);
        });
        break;
      default:
        throw new Error('impossible missing method for ipc handler methods');
    }
  });
}
