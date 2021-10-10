import { IpcSetup } from '@shared/types';

export const handlerMethods: IpcSetup = {
  windowFocus: { main: 'on', renderer: 'send' },
  setTrayIcon: { main: 'on', renderer: 'send' },
  setTrayTitle: { main: 'on', renderer: 'send' },
  openExternal: { main: 'on', renderer: 'send' },
  storeRead: { main: 'handle', renderer: 'invoke' },
  storeReset: { main: 'handle', renderer: 'invoke' },
  storeUpdate: { main: 'handle', renderer: 'invoke' },
  slackEndSnooze: { main: 'handle', renderer: 'invoke' },
  slackSetPresence: { main: 'handle', renderer: 'invoke' },
  slackSetProfile: { main: 'handle', renderer: 'invoke' },
  slackSetSnooze: { main: 'handle', renderer: 'invoke' },
};
