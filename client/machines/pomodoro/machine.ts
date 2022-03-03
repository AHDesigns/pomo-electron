import { override } from '@shared/merge';
import { DeepPartial } from '@shared/types';
import { InterpreterFrom, send } from 'xstate';
// import timerMachine from '../timer/machine';
// import timerModel from '../timer/model';
import model, { PomodoroModel } from './model';

// import { createMachine, send, sendParent, forwardTo, assign } from 'xstate';

const pomodoroMachine = model.createMachine(
  {
    id: 'pomodoroMachine',
    context: model.initialContext,
    type: 'parallel',
    states: {
      pomodoro: {
        initial: 'pomo',
        states: {
          pomo: {
            entry: 'resetTimerPomo',
            on: {
              STOP: 'pomo',
              _COMPLETE: [
                {
                  cond: 'isLongBreak',
                  actions: ['increaseCompletedCount'],
                  target: 'long',
                },
                {
                  actions: ['increaseCompletedCount'],
                  target: 'short',
                },
              ],
            },
          },
          short: {
            entry: 'resetTimerShort',
            on: {
              _COMPLETE: 'pomo',
              STOP: 'pomo',
            },
          },
          long: {
            entry: 'resetTimerLong',
            on: {
              _COMPLETE: 'pomo',
              STOP: 'pomo',
            },
          },
        },
      },
      timer: {
        initial: 'ready',
        states: {
          ready: {
            on: {
              START: 'playing',
            },
          },
          playing: {
            invoke: {
              id: 'second-timer',
              src: 'countOneSecond',
            },
            on: {
              _TICK: [
                {
                  cond: 'isTimerFinished',
                  actions: send(model.events._COMPLETE()),
                  target: 'ready',
                },
                { actions: 'updateTimer', target: 'playing' },
              ],
              PAUSE: 'paused',
              STOP: 'ready',
            },
          },
          paused: {
            on: {
              PLAY: 'playing',
              STOP: 'ready',
            },
          },
        },
      },
    },
  },
  {
    services: {
      countOneSecond: () => (sendBack) => {
        const id = setInterval(() => sendBack(model.events._TICK()), 1000);
        return () => clearInterval(id);
      },
    },
    guards: {
      isTimerFinished: ({ active: { minutes, seconds } }) => minutes === 0 && seconds === 1,
      isLongBreak: ({ completed: { pomo } }) => pomo !== 0 && pomo % 4 === 0,
    },
    actions: {
      updateTimer: model.assign({
        active: ({ active: { minutes, seconds } }) =>
          seconds === 0 ? { minutes: minutes - 1, seconds: 59 } : { minutes, seconds: seconds - 1 },
      }),
      increaseCompletedCount: model.assign({
        completed: ({ completed }) => override(completed, { pomo: completed.pomo + 1 }),
      }),
      resetTimerPomo: model.assign({
        active: ({ timers: { pomo } }) => ({ seconds: 0, minutes: pomo }),
      }),
      resetTimerShort: model.assign({
        active: ({ timers: { short } }) => ({ seconds: 0, minutes: short }),
      }),
      resetTimerLong: model.assign({
        active: ({ timers: { long } }) => ({ seconds: 0, minutes: long }),
      }),
    },
  }
);

export type PomodoroMachine = InterpreterFrom<typeof pomodoroMachine>;

interface IPomodoro {
  context?: DeepPartial<PomodoroModel>;
}

function pomodoroMachineFactory(props?: IPomodoro): typeof pomodoroMachine {
  return pomodoroMachine.withContext(override(model.initialContext, props?.context));
}

export default pomodoroMachineFactory;
