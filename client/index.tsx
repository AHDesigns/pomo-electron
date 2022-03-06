import { fakeRepositories } from '@electron/repositories/fakes';
import { IBridge, IClientLogger } from '@shared/types';
import React from 'react';
import { render } from 'react-dom';
// import { ipcRenderer } from '@electron/electron';
// import { bridgeCreator } from '@electron/ipc/bridgeCreator';
// import { createLogger } from '@electron/services/logger';
// import log from 'electron-log';
import { Providers } from './Providers';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const bridge = getElectronBridgeOrMock();

// render(<Providers bridge={bridgeCreator(ipcRenderer)} logger={createLogger(log)} />, mainElement);
const logger: IClientLogger = {
  error: bridge.logError,
  warn: bridge.logWarn,
  info: bridge.logInfo,
};

render(<Providers bridge={bridge} logger={logger} />, mainElement);

function getElectronBridgeOrMock(): IBridge {
  if (window.bridge as unknown) return window.bridge;

  return {
    ...fakeRepositories(),
    logWarn: console.warn,
    logError: console.error,
    logInfo: console.log,
    openExternal: async (url) => {
      window.open(url);
      return Promise.resolve();
    },
  };
}
