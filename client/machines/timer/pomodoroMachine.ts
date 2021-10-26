import { assign, spawn, EventFrom } from 'xstate';
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
      stop: { actions: 'onStopHooks' },
      tick: { actions: 'onTickHooks' },
    },
    states: {
      pomodoro: {
        // entry: ['createPomoTimer', pomodoroModel.assign({ current: 'pomo' })],
        entry: [
          assign({
            pomodoro: ({ timers }) => spawn(createTimerMachine({ duration: timers.pomo })),
          }),
        ],
        on: {
          complete: {
            target: 'break',
            actions: ['increasePomoCount'],
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
        // entry: [pomodoroModel.assign({ current: 'shortBreak' })],
        entry: [
          assign({
            pomodoro: ({ timers }) => spawn(createTimerMachine({ duration: timers.shortBreak })),
          }),
        ],
        on: {
          complete: {
            target: 'pomodoro',
          },
          stop: {
            target: 'pomodoro',
          },
        },
      },
      longBreak: {
        // entry: [pomodoroModel.assign({ current: 'longBreak' })],
        entry: [
          assign({
            pomodoro: ({ timers }) => spawn(createTimerMachine({ duration: timers.longBreak })),
          }),
        ],
        on: {
          complete: {
            target: 'pomodoro',
          },
          stop: {
            target: 'pomodoro',
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

// type PomodoroOptions = OptionsFromModel<typeof pomodoroModel>;
//
// const s: PomodoroOptions['actions']['onPauseHooks'] = ({}) => {};
//
// type Action = (
//   context: ModelContextFrom<typeof pomodoroModel>,
//   event: EventFrom<typeof pomodoroModel>
// ) => void;

//
// interface PomoOptions {
//   actions: {
//     onStartHooks: Action;
//     onPauseHooks: Action;
//     onPlayHooks: Action;
//     onStopHooks: Action;
//   };
// }
//
// export function pomodoroOptionsCreator({ actions }: PomoOptions): PomodoroOptions {
//   return {
//     guards: {
//       isTimeForLongBreak: ({ completed: { pomos }, breakNumber }) =>
//         pomos > 0 && pomos % breakNumber === 0,
//     },
//     actions: {
//       increasePomoCount: assign({
//         completed: ({ completed }) => ({
//           ...completed,
//           pomos: completed.pomos + 1,
//         }),
//       }),
//       increaseLongBreakCount: assign({
//         completed: ({ completed }) => ({
//           ...completed,
//           long: completed.long + 1,
//         }),
//       }),
//       createPomoTimer: assign({
//         pomodoro: ({ pomodoro, timers }) =>
//           pomodoro.else(
//             spawn(
//               timerMachine.withContext({
//                 timerType: 'pomodoro',
//                 autoStart: false,
//                 timeLeft: { mins: 0, seconds: 0 },
//                 duration: timers.pomo,
//               })
//             )
//           ),
//       }),
//       ...actions,
//     },
//   };
// }
//
export default pomodoroMachine;
