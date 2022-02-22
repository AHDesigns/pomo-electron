import { spawn } from 'xstate';
import { some } from '@shared/Option';
import { assertEventType } from '../utils';
import model, { timerMachine } from './model';

const updatePomoSettings = model.assign(
  {
    pomodoro: ({ pomodoro }, { minutes }) => ({
      ...pomodoro,
      settings: {
        ...pomodoro.settings,
        minutes,
      },
    }),
  },
  'setPomoTimer'
);

const appMachine = model.createMachine(
  {
    context: model.initialContext,
    initial: 'init',
    states: {
      init: {
        // can peform setup if needed
        always: 'loaded',
      },
      loaded: {
        initial: 'timerView',
        on: {
          view: [
            { cond: (_, { page }) => page === 'timers', target: '.timerView' },
            { target: '.settingsView' },
          ],
        },
        states: {
          timerView: {
            on: {
              startPomo: {
                actions: [
                  model.assign({
                    pomodoro: ({ pomodoro }) => ({
                      ...pomodoro,
                      active: spawn(timerMachine),
                    }),
                  }),
                ],
              },
              pausePomo: {
                actions: [
                  () => {
                    console.log('lol');
                  },
                ],
              },
            },
          },
          settingsView: {
            on: {
              setPomoTimer: {
                actions: [updatePomoSettings],
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {},
    actions: {},
  }
);

export default appMachine;
