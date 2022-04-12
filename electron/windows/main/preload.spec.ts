import { contextBridge as _contextBridge, ipcRenderer } from 'electron';
import { mocked } from 'ts-jest/utils';
import { bridgeCreator } from '@electron/ipc/bridgeCreator';
import { exposeMinimalBridgeApiToClient } from './preload';

jest.mock('@electron/ipc/bridgeCreator', () => ({
  bridgeCreator() {
    return { foo: '' };
  },
}));
const contextBridge = mocked(_contextBridge);

jest.mock('electron');

test('setUpBridge', () => {
  exposeMinimalBridgeApiToClient();
  expect(contextBridge.exposeInMainWorld).toHaveBeenCalledWith(
    'bridge',
    expect.objectContaining(bridgeCreator(ipcRenderer))
  );
});
