import React from 'react';
import { render } from 'react-dom';
import { getElectronBridgeOrMock } from './getElectronBridgeOrMock';
import { Providers } from './Providers';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

const bridge = getElectronBridgeOrMock();

render(<Providers bridge={bridge} />, mainElement);
