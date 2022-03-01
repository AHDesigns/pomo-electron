import React from 'react';
import { render } from 'react-dom';
import { ipcRenderer } from '@electron/electron';
import { bridgeCreator } from '@electron/ipc/bridgeCreator';
import { createLogger } from '@electron/services/logger';
import log from 'electron-log';
import { Providers } from './Providers';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(<Providers bridge={bridgeCreator(ipcRenderer)} logger={createLogger(log)} />, mainElement);
