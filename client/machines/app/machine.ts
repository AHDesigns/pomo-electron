import { spawn } from 'xstate';
import { some } from '@shared/Option';
import { assertEventType } from '../utils';
import model from './model';

// const updatePomoSettings = model.assign(
//   {
//     pomodoro: ({ pomodoro }, { minutes }) => ({
//       ...pomodoro,
//       settings: {
//         ...pomodoro.settings,
//         minutes,
//       },
//     }),
//   },
//   'setPomoTimer'
// );

const appMachine = model.createMachine(
  {
    context: model.initialContext,
    type: 'parallel',
    states: {},
  },
  {
    guards: {},
    actions: {},
  }
);

export default appMachine;
