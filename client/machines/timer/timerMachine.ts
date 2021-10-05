// eslint-disable-next-line import/no-extraneous-dependencies
import { createMachine, StateWithMatches } from '@xstate/compiled';
import { MachineOptions } from '../utils';

export interface TimerContext {
  duration: number;
  autoStart: boolean;
  timeLeft: {
    mins: number;
    seconds: number;
  };
}

export const defaultTimerContext: TimerContext = {
  duration: 1,
  autoStart: false,
  timeLeft: { mins: 0, seconds: 0 },
};

type TimerEvent = { type: 'PAUSE' } | { type: 'PLAY' } | { type: 'STOP' };

export type TimerState = StateWithMatches<TimerContext, TimerEvent, 'timer'>;
export type TimerOptions = MachineOptions<TimerContext, TimerEvent, 'timer'>;

export const timerMachine = createMachine<TimerContext, TimerEvent, 'timer'>({
  id: 'timerMachine',
  context: defaultTimerContext,
  initial: 'initial',
  states: {
    initial: {
      onEntry: 'resetTimer',
      on: {
        PLAY: 'counting',
      },
      always: {
        cond: ({ autoStart }) => autoStart,
        target: 'counting',
      },
    },
    counting: {
      on: {
        PAUSE: 'paused',
        STOP: 'initial',
      },
      after: {
        ONE_SECOND: [
          {
            cond: 'isComplete',
            target: 'complete',
          },
          {
            actions: ['decrement1Second', 'tickEvent'],
            target: 'counting',
          },
        ],
      },
    },
    paused: {
      on: {
        PLAY: 'counting',
        STOP: 'initial',
      },
    },
    complete: {
      onEntry: ['decrement1Second', 'completed'],
      type: 'final',
    },
  },
});
