import { assign, spawn } from 'xstate';
import { OptionsFromModel } from '@client/machines/utils';
import { ModelContextFrom } from 'xstate/lib/model.types';
import { ModelEventsFrom } from 'xstate/es/model.types';
import timerMachine from './timerMachine';
import { pomodoroModel } from './pomodoroModel';

const pomodoroMachine = pomodoroModel.createMachine(
  {
    id: 'pomodoro',
    context: pomodoroModel.initialContext,
    initial: 'pomodoro',
    states: {
      pomodoro: {
        entry: 'createPomoTimer',
        on: {
          complete: {
            target: 'break',
            actions: ['increasePomoCount', pomodoroModel.actions.onCompleteHooks('pomo')],
          },
          start: [{ actions: pomodoroModel.actions.onStartHooks('pomo') }],
          pause: [{ actions: pomodoroModel.actions.onPauseHooks('pomo') }],
          play: [{ actions: pomodoroModel.actions.onPlayHooks('pomo') }],
          stop: [{ actions: pomodoroModel.actions.onStopHooks('pomo') }],
          tick: [{ actions: pomodoroModel.actions.onTickHooks('pomo') }],
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
        on: {
          complete: {
            target: 'pomodoro',
            actions: [pomodoroModel.actions.onCompleteHooks('shortBreak')],
          },
          start: [{ actions: pomodoroModel.actions.onStartHooks('shortBreak') }],
          pause: [{ actions: pomodoroModel.actions.onPauseHooks('shortBreak') }],
          play: [{ actions: pomodoroModel.actions.onPlayHooks('shortBreak') }],
          stop: {
            target: 'pomodoro',
            actions: pomodoroModel.actions.onStopHooks('shortBreak'),
          },
          tick: [{ actions: pomodoroModel.actions.onTickHooks('shortBreak') }],
        },
      },
      longBreak: {
        on: {
          complete: {
            target: 'pomodoro',
            actions: [pomodoroModel.actions.onCompleteHooks('shortBreak')],
          },
          start: [{ actions: pomodoroModel.actions.onStartHooks('shortBreak') }],
          pause: [{ actions: pomodoroModel.actions.onPauseHooks('shortBreak') }],
          play: [{ actions: pomodoroModel.actions.onPlayHooks('shortBreak') }],
          stop: {
            target: 'pomodoro',
            actions: pomodoroModel.actions.onStopHooks('shortBreak'),
          },
          tick: [{ actions: pomodoroModel.actions.onTickHooks('shortBreak') }],
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
      onStartHooks: (_, c, { action: { timer } }) => {},
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
      createPomoTimer: assign({
        pomodoro: ({ pomodoro, timers }) =>
          pomodoro.else(
            spawn(
              timerMachine.withContext({
                timerType: 'pomodoro',
                autoStart: false,
                timeLeft: { mins: 0, seconds: 0 },
                duration: timers.pomo,
              })
            )
          ),
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
//   event: ModelEventsFrom<typeof pomodoroModel>
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
