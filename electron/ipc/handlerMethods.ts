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
  info: { main: 'on', renderer: 'send' },
  warn: { main: 'on', renderer: 'send' },
  error: { main: 'on', renderer: 'send' },
  isIntegration: { main: 'handle', renderer: 'invoke' },
  isDev: { main: 'handle', renderer: 'invoke' },
  isTest: { main: 'handle', renderer: 'invoke' },
  isProd: { main: 'handle', renderer: 'invoke' },
  nodenv: { main: 'handle', renderer: 'invoke' },
};
