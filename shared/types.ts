/* eslint-disable @typescript-eslint/no-explicit-any */
import { ThemeName } from '@client/theme';
import { IpcMainEvent, IpcMainInvokeEvent } from '@electron/electron';
import { Repositories } from '@electron/repositories';
import { ElectronLog } from 'electron-log';
import React from 'react';

export interface ILogger extends ElectronLog {
  info: (...msg: any[]) => void;
  errorWithContext(context: string): (err: Error | string) => void;
}

export type IClientLogger = Pick<ILogger, 'error' | 'info' | 'warn'>;

export type TimerType = keyof UserConfig['timers'];

export const emptyConfig: UserConfig = {
  timers: {
    pomo: 10,
    short: 5,
    long: 15,
  },
  displayTimerInStatusBar: true,
  longBreakEvery: 3,
  autoStart: {
    beforeShortBreak: true,
    beforeLongBreak: true,
    beforePomo: false,
  },
  slack: { enabled: false },
  theme: 'nord',
};

export interface UserConfig {
  timers: {
    pomo: number;
    short: number;
    long: number;
  };
  displayTimerInStatusBar: boolean;
  longBreakEvery: number;
  autoStart: {
    beforeShortBreak: boolean;
    beforeLongBreak: boolean;
    beforePomo: boolean;
  };
  slack:
    | {
        enabled: true;
        slackToken: string;
        slackDCookie: string;
        slackDSCookie: string;
      }
    | { enabled: false };
  theme: ThemeName;
}

/**
 * IpcBridge is a meta type to glue together the client and server through the bridge.
 * This allows us to create methods which must then exist on subsequent types, but
 * we can pick the relevant details from this object.
 *
 * See the derived types below
 */
type IpcBridge = {
  [key in keyof Repositories]: {
    param: Parameters<Repositories[key]>;
    response: ReturnType<Repositories[key]>;
  };
};

export type IBridge = {
  [key in keyof IpcBridge]: (...args: IpcBridge[key]['param']) => IpcBridge[key]['response'];
};

export type IpcHandlers = {
  [key in keyof IpcBridge]: (
    event: IpcBridge[key]['response'] extends Promise<unknown> ? IpcMainInvokeEvent : IpcMainEvent,
    args: IpcBridge[key]['param']
  ) => IpcBridge[key]['response'];
};

export type IpcSetup = {
  [key in keyof IpcBridge]: Handle | Send;
};

interface Send {
  renderer: 'send';
  main: 'on';
}

interface Handle {
  renderer: 'invoke';
  main: 'handle';
}

export type Partial2Deep<T> = {
  [P in keyof T]?: Partial<T[P]>;
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface AnyObject {
  [key: string]: any;
}

type CssSizeUnits = '%' | 'em' | 'px';
export type CssSize = `${string}${CssSizeUnits}`;

export interface HookContext {
  timer: {
    minutes: number;
    seconds: number;
    type: TimerType;
    autoStart: boolean;
  };
  config: UserConfig;
  bridge: IBridge;
}

type Hook = (context: HookContext) => void;

export interface TimerHooks {
  onStartHook: Hook;
  onTickHook: Hook;
  onPauseHook: Hook;
  onPlayHook: Hook;
  onStopHook: Hook;
  onCompleteHook: Hook;
}

export interface IChildren {
  children: React.ReactNode;
}
