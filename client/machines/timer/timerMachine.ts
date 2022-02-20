/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ActorRefFrom, assign, ContextFrom, sendParent } from 'xstate';
import { pomodoroModel } from './pomodoroModel';
import { TimerContext, TimerEvents, timerModel } from './timerModel';

const timerMachine = timerModel.createMachine({
  id: 'timer',
  context: timerModel.initialContext,
  initial: 'ready',
  states: {
    ready: {
      entry: 'setTimer',
      always: {
        cond: ({ autoStart }) => autoStart,
        target: 'counting',
      },
      on: {
        play: 'counting',
      },
      exit: 'fudge',
    },
    counting: {
      on: {
        pause: 'paused',
        stop: 'stopped',
        complete: 'complete',
      },
      after: {
        ONE_SECOND: [
          {
            cond: 'isComplete',
            target: 'complete',
          },
          {
            actions: ['decrement1Second', 'butter'],
            target: 'counting',
          },
        ],
      },
    },
    paused: {
      entry: ['cheese'],
      on: {
        play: {
          actions: ['fish'],
          target: 'counting',
        },
        stop: 'stopped',
      },
    },
    complete: {
      entry: ['cat'],
      type: 'final',
    },
    stopped: {
      entry: ['dog'],
      type: 'final',
    },
  },
});

export const defaultOptions = {
  delays: {
    ONE_SECOND: 1000,
  },
  guards: {
    isComplete: ({ timeLeft: { mins, seconds } }: TimerContext) => mins === 0 && seconds === 1,
  },
  actions: {
    setTimer: assign<TimerContext>({
      timeLeft: ({ duration }) => ({
        mins: duration,
        seconds: 0,
      }),
    }),
    decrement1Second: assign<TimerContext>({
      timeLeft: ({ timeLeft: { mins, seconds } }) =>
        seconds === 0 ? { mins: mins - 1, seconds: 59 } : { mins, seconds: seconds - 1 },
    }),
    fudge: sendParent<TimerContext, TimerEvents>(({ timeLeft, timerType }) =>
      pomodoroModel.events.start({ ...timeLeft, timer: timerType })
    ),
    butter: sendParent<TimerContext, TimerEvents>(({ timeLeft, timerType }) =>
      pomodoroModel.events.tick({ ...timeLeft, timer: timerType })
    ),
    cheese: sendParent<TimerContext, TimerEvents>(({ timeLeft, timerType }) =>
      pomodoroModel.events.pause({ ...timeLeft, timer: timerType })
    ),
    fish: sendParent<TimerContext, TimerEvents>(({ timeLeft, timerType }) =>
      pomodoroModel.events.play({ ...timeLeft, timer: timerType })
    ),
    cat: sendParent<TimerContext, TimerEvents>(({ timeLeft, timerType }) =>
      pomodoroModel.events.complete({ ...timeLeft, timer: timerType })
    ),
    dog: sendParent<TimerContext, TimerEvents>(({ timeLeft, timerType }) =>
      pomodoroModel.events.stop({ ...timeLeft, timer: timerType })
    ),
  },
};

export type TimerActor = ActorRefFrom<typeof timerMachine>;

type TimerFactoryConfig = Pick<ContextFrom<typeof timerModel>, 'duration'>;

export function createTimerMachine({ duration }: TimerFactoryConfig) {
  return timerMachine
    .withContext({
      timerType: 'pomo',
      autoStart: false,
      timeLeft: { mins: 0, seconds: 0 },
      duration,
    })
    .withConfig(defaultOptions);
}

export default timerMachine;
