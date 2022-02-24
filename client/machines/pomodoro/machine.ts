import { ContextFrom, createMachine } from 'xstate';
import { createModel } from 'xstate/lib/model';
import model from './model';

export const timerModel = createModel(
  {
    minutes: 0,
    seconds: 0,
  },
  {
    events: {
      TICK: () => ({}),
      BUMP: () => ({}),
    },
  }
);

export type TimerContext = ContextFrom<typeof timerModel>;

export const timerMachine = timerModel.createMachine(
  {
    context: timerModel.initialContext,
    initial: 'counting',
    states: {
      counting: {
        invoke: {
          src: () => (cb) => {
            const interval = setInterval(() => {
              cb(timerModel.events.TICK());
            }, 100);
            return () => {
              clearInterval(interval);
            };
          },
        },
        on: {
          TICK: [
            {
              cond: 'isTimerFinished',
              target: 'finished',
            },
            {
              actions: 'decrementOneSecond',
            },
          ],
          BUMP: { actions: ['addMinute'] },
        },
      },
      finished: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      isTimerFinished: ({ minutes, seconds }) => minutes === 0 && seconds === 0,
    },
    actions: {
      decrementOneSecond: timerModel.assign(({ seconds, minutes }) => {
        if (seconds === 0) {
          return { minutes: minutes - 1, seconds: 59 };
        }
        return { minutes, seconds: seconds - 1 };
      }),
      addMinute: timerModel.assign({
        minutes: ({ minutes }) => minutes + 1,
      }),
    },
  }
);

const pomodoroMachine = model.createMachine({
  context: model.initialContext,
  initial: 'inactive',
  states: {
    inactive: {
      on: { POMO_PLAY: 'pomo' },
    },
    pomo: {
      entry: ['onStartHooks'],
      invoke: {
        id: 'timer',
        src: timerMachine,
        data: ({ pomodoro: { active } }) => ({ ...active }),
      },
    },
    shortBreak: {},
    longBreak: {},
  },
});

export default pomodoroMachine;
