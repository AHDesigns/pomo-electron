import { override } from '@shared/merge';
import { DeepPartial } from '@shared/types';
import { InterpreterFrom, send } from 'xstate';
import model, { PomodoroModel } from './model';

const ONE_SECOND = 1000;

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
            entry: ['resetTimerPomo'],
            on: {
              _COMPLETE: [
                {
                  cond: 'isLongBreak',
                  target: 'long',
                },
                {
                  target: 'short',
                },
              ],
              STOP: 'stopping',
            },
          },
          short: {
            entry: 'resetTimerShort',
            on: {
              _COMPLETE: 'pomo',
              STOP: 'stopping',
            },
          },
          long: {
            entry: 'resetTimerLong',
            on: {
              _COMPLETE: 'pomo',
              STOP: { target: 'stopping', actions: 'increaseCompletedCount' },
            },
          },
          stopping: {
            meta: {
              description:
                'transition state to work get access to context before the timer is reset, fix in v5',
            },
            entry: ['onStopHook', send('_STOPPED')],
            on: { _STOPPED: 'pomo' },
          },
        },
      },
      timer: {
        initial: 'ready',
        states: {
          ready: {
            on: {
              START: { target: 'playing', actions: ['onStartHook'] },
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
                  actions: [
                    send(model.events._COMPLETE()),
                    'increaseCompletedCount',
                    'onCompleteHook',
                  ],
                  target: 'ready',
                },
                { actions: ['updateTimer', 'onTickHook'], target: 'playing' },
              ],
              PAUSE: 'paused',
              STOP: 'ready',
            },
          },
          paused: {
            entry: ['onPauseHook'],
            on: {
              PLAY: { target: 'playing', actions: ['onPlayHook'] },
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
        const id = setInterval(() => sendBack(model.events._TICK()), ONE_SECOND);
        return () => clearInterval(id);
      },
    },
    guards: {
      isTimerFinished: ({ active: { minutes, seconds } }) => minutes === 0 && seconds === 1,
      isLongBreak: ({ completed: { pomo } }) => pomo !== 0 && pomo % 4 === 0,
    },
    actions: {
      updateTimer: model.assign({
        active: ({ active: { minutes, seconds, type } }) =>
          seconds === 0
            ? { minutes: minutes - 1, seconds: 59, type }
            : { minutes, seconds: seconds - 1, type },
      }),
      increaseCompletedCount: model.assign({
        completed: ({ completed, active: { type } }) => ({
          ...completed,
          [type]: completed[type] + 1,
        }),
      }),
      resetTimerPomo: model.assign({
        active: ({ timers: { pomo } }) => ({ seconds: 0, minutes: pomo, type: 'pomo' }),
      }),
      resetTimerShort: model.assign({
        active: ({ timers: { short } }) => ({ seconds: 0, minutes: short, type: 'short' }),
      }),
      resetTimerLong: model.assign({
        active: ({ timers: { long } }) => ({ seconds: 0, minutes: long, type: 'long' }),
      }),
    },
  }
);

export type PomodoroMachine = InterpreterFrom<typeof pomodoroMachine>;

interface Hook {
  (info: { minutes: number; seconds: number; type: 'long' | 'pomo' | 'short' }): void;
}

export interface IPomodoroMachine {
  context?: DeepPartial<PomodoroModel>;
  actions: {
    onStartHook: Hook;
    onTickHook: Hook;
    onPauseHook: Hook;
    onPlayHook: Hook;
    onStopHook: Hook;
    onCompleteHook: Hook;
  };
}

function pomodoroMachineFactory({ context, actions }: IPomodoroMachine): typeof pomodoroMachine {
  return pomodoroMachine.withContext(override(model.initialContext, context)).withConfig({
    actions: {
      onStartHook: ({ active }) => {
        actions.onStartHook({ ...active });
      },
      onTickHook: ({ active }) => {
        actions.onTickHook({ ...active });
      },
      onPauseHook: ({ active }) => {
        actions.onPauseHook({ ...active });
      },
      onPlayHook: ({ active }) => {
        actions.onPlayHook({ ...active });
      },
      onStopHook: ({ active }) => {
        actions.onStopHook({ ...active });
      },
      onCompleteHook: ({ active }) => {
        actions.onCompleteHook({ ...active });
      },
    },
  });
}

export default pomodoroMachineFactory;
