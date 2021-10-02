// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';

import { UserConfig } from '@shared/types';
import { TimerContext } from '../timer/timerMachine';
import { MachineOptions, MachineSend } from '../utils';

export interface AppContext {
  completed: {
    pomos: number;
    longBreaks: number;
  };
  breakNumber: number;
  timers: UserConfig['timers'];
  autoStart: UserConfig['autoStart'];
}

export const defaultAppSettings: AppContext = {
  completed: { longBreaks: 0, pomos: 0 },
  autoStart: { beforeLongBreak: false, beforePomo: false, beforeShortBreak: true },
  timers: { longBreak: 25, pomo: 25, shortBreak: 5 },
  breakNumber: 4,
};

type AppEvent =
  | { type: 'COMPLETE' }
  | { type: 'START' }
  | { type: 'STOP' }
  | { type: 'TICK'; timeLeft: TimerContext['timeLeft'] };

export type AppOptions = MachineOptions<AppContext, AppEvent, 'app'>;
export type AppState = StateWithMatches<AppContext, AppEvent, 'app'>;
export type AppSend = MachineSend<AppContext, AppEvent, 'app'>;

export const appMachine = createMachine<AppContext, AppEvent, 'app'>({
  id: 'appMachine',
  context: {
    ...defaultAppSettings,
  },
  initial: 'pomo',
  states: {
    pomo: {
      initial: 'inactive',
      states: {
        inactive: {
          on: { START: 'running' },
          always: [{ cond: 'autoStartPomo', target: 'running' }],
        },
        running: {
          onEntry: 'runStartHooks',
          onExit: 'runEndHooks',
          on: {
            STOP: 'inactive',
            COMPLETE: 'complete',
          },
        },
        complete: {
          onEntry: 'incrementPomo',
          type: 'final',
        },
      },
      on: {
        TICK: {
          actions: 'runTickHook',
        },
      },
      onDone: [{ cond: 'isTimeForLongBreak', target: 'longBreak' }, { target: 'shortBreak' }],
    },
    shortBreak: breaks([]),
    longBreak: breaks(['incrementLongBreak']),
  },
});

function breaks(action: 'incrementLongBreak'[]): any {
  return {
    initial: 'inactive',
    states: {
      inactive: {
        always: [{ cond: 'autoStartBreak', target: 'running' }],
        on: { START: 'running' },
      },
      running: {
        on: {
          STOP: 'complete',
          COMPLETE: 'complete',
        },
      },
      complete: {
        onEntry: action,
        type: 'final',
      },
    },
    onDone: {
      target: 'pomo',
    },
  } as const;
}
