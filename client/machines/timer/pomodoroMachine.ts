import { assign, spawn, EventFrom, actions } from 'xstate';
import { OptionsFromModel } from '@client/machines/utils';
import { ModelContextFrom } from 'xstate/lib/model.types';
import { ModelEventsFrom } from 'xstate/es/model.types';
import { some } from '@shared/Option';
import timerMachine, { createTimerMachine } from './timerMachine';
import { pomodoroModel } from './pomodoroModel';

const pomodoroMachine = pomodoroModel.createMachine(
  {
    id: 'pomodoro',
    context: pomodoroModel.initialContext,
    initial: 'pomodoro',
    on: {
      start: { actions: 'onStartHooks' },
      pause: { actions: 'onPauseHooks' },
      play: { actions: 'onPlayHooks' },
      tick: { actions: 'onTickHooks' },
    },
    states: {
      pomodoro: {
        entry: [
          assign({
            pomodoro: ({ timers }) => spawn(createTimerMachine({ duration: timers.pomo }), 'pomo'),
          }),
        ],
        on: {
          stop: {
            target: 'pomodoro',
            actions: ['onStopHooks'],
          },
          complete: {
            target: 'break',
            actions: ['increasePomoCount', 'onCompleteHooks'],
          },
        },
      },
      break: {
        always: [
          {
            cond: 'isTimeForLongBreak',
            target: 'longBreak',
          },
          { target: 'shortBreak' },
        ],
      },
      shortBreak: {
        entry: [
          assign({
            pomodoro: ({ timers }) =>
              spawn(createTimerMachine({ duration: timers.shortBreak }), 'short'),
          }),
        ],
        on: {
          complete: {
            target: 'pomodoro',
            actions: ['onCompleteHooks'],
          },
          stop: {
            target: 'pomodoro',
            actions: ['onStopHooks'],
          },
        },
      },
      longBreak: {
        entry: [
          assign({
            pomodoro: ({ timers }) =>
              spawn(createTimerMachine({ duration: timers.longBreak }), 'long'),
          }),
        ],
        on: {
          complete: {
            target: 'pomodoro',
            actions: ['onCompleteHooks'],
          },
          stop: {
            target: 'pomodoro',
            actions: ['onStopHooks'],
          },
        },
        exit: 'increaseLongBreakCount',
      },
    },
  },
  {
    guards: {
      isTimeForLongBreak: ({ completed: { pomos }, breakNumber }) =>
        pomos > 0 && pomos % breakNumber === 0,
    },
    actions: {
      increasePomoCount: assign({
        completed: ({ completed }) => ({
          ...completed,
          pomos: completed.pomos + 1,
        }),
      }),
      increaseLongBreakCount: assign({
        completed: ({ completed }) => ({
          ...completed,
          long: completed.long + 1,
        }),
      }),
    },
  }
);

export default pomodoroMachine;
