import { override } from '@shared/merge';
import { DeepPartial } from '@shared/types';
import { ContextFrom, InterpreterFrom, send, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import model, { PomodoroModel } from './model';

export const timerModel = createModel(
  {
    minutes: 0,
    seconds: 0,
  },
  {
    events: {
      TICK: () => ({}),
      BUMP: () => ({}),
      PAUSE: () => ({}),
      PLAY: () => ({}),
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
          src: 'countOneSecond',
        },
        on: {
          TICK: [
            {
              cond: 'isTimerFinished',
              target: 'finished',
            },
            {
              actions: ['decrementOneSecond', 'updateParent'],
            },
          ],
          BUMP: { actions: ['addMinute'] },
          PAUSE: 'paused',
        },
      },
      paused: {
        on: {
          PLAY: 'counting',
        },
      },
      finished: {
        type: 'final',
      },
    },
  },
  {
    services: {
      countOneSecond: () => (sendBack) => {
        const interval = setInterval(() => {
          sendBack(timerModel.events.TICK());
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      },
    },
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
      updateParent: sendParent(({ minutes, seconds }) => model.events.TIMER_TICK(minutes, seconds)),
    },
  }
);

const pomodoroMachine = model.createMachine(
  {
    context: model.initialContext,
    type: 'parallel',
    states: {
      timer: {
        initial: 'inactive',
        states: {
          inactive: {
            entry: [send('RESET')],
            on: {
              POMO_START: {
                actions: ['onStartHooks'],
                target: 'active',
              },
              RESET: {
                actions: ['resetTimerDisplay'],
              },
            },
          },
          paused: {
            on: {
              POMO_START: {
                actions: [send(timerModel.events.PLAY, { to: 'timer' }), 'onPlayHooks'],
                target: 'active',
              },
              POMO_STOP: {
                target: 'inactive',
                actions: ['onStopHooks'],
              },
            },
          },
          active: {
            on: {
              POMO_PAUSE: {
                target: 'paused',
                actions: [send(timerModel.events.PAUSE, { to: 'timer' }), 'onPauseHooks'],
              },
              POMO_STOP: {
                target: 'inactive',
                actions: ['onStopHooks'],
              },
              TIMER_TICK: {
                actions: ['updateTimer', 'onTickHooks'],
              },
            },
          },
        },
      },
      current: {
        initial: 'inactive',
        states: {
          inactive: {
            on: {
              POMO_START: 'pomo',
            },
          },
          pomo: {
            invoke: {
              id: 'timer',
              src: timerMachine,
              data: ({ pomodoro: { active } }) => ({ ...active }),
            },
            on: {
              POMO_STOP: 'inactive',
            },
          },
          shortBreak: {},
          longBreak: {},
        },
      },
    },
  },
  {
    actions: {
      resetTimerDisplay: model.assign({
        pomodoro: ({ pomodoro, timers }) =>
          override(pomodoro, {
            active: {
              minutes: timers.pomo,
              seconds: 0,
            },
          }),
      }),
      updateTimer: model.assign({
        pomodoro: ({ pomodoro }, e) => {
          if (e.type !== 'TIMER_TICK') return pomodoro;

          return override(pomodoro, {
            active: {
              minutes: e.minutes,
              seconds: e.seconds,
            },
          });
        },
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
