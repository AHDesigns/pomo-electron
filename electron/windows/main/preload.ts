import { contextBridge, ipcRenderer } from '@electron/electron';
import { isIntegration } from '@shared/constants';
import { bridgeCreator } from '@electron/ipc/bridgeCreator';
import { deepFreeze } from '@shared/deepFreeze';

const not = (bool: boolean): boolean => !bool;

/**
 * Integration is required for e2e testing with Spectron
 *
 * the contextBridge prevents the client access `require` which is not desirable in most situations
 * however spectron needs access to the `remote` module via `require`, so we have to
 * bypass this security feature for this scenario
 */
/* istanbul ignore else */
if (not(isIntegration)) {
  exposeMinimalBridgeApiToClient();
} else {
  /**
   * This mimics the behaviour of the context bridge to keep behaviour as prod-like as possible
   */
  window.bridge = deepFreeze(bridgeCreator(ipcRenderer));

  // eval('require') here stops webpack trying to work out what's being imported
  // this removes some warnings and prevents `require` becoming webpack's own
  // `_webpack_require`, which seemed to keep failing

  // @ts-expect-error just for spectron to have access to running electron
  // eslint-disable-next-line no-eval,@typescript-eslint/no-unsafe-assignment
  window.electronRequire = eval('require');
}

export function exposeMinimalBridgeApiToClient(): void {
  contextBridge.exposeInMainWorld('bridge', bridgeCreator(ipcRenderer));
}
