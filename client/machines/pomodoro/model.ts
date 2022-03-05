import { emptyConfig } from '@shared/types';
import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

// interface AdhocTimer {
//   minutes: number;
//   seconds: number;
// }

const pomodoroModel = createModel(
  {
    completed: {
      pomo: 0,
      short: 0,
      long: 0,
    },
    timers: emptyConfig.timers,
    autoStart: emptyConfig.autoStart,
  },
  {
    events: {
      'done.invoke.timer-actor': (complete: boolean) => ({ data: { complete } }),
      CONFIG_LOADED: (
        timers: typeof emptyConfig.timers,
        autoStart: typeof emptyConfig.autoStart
      ) => ({ data: { timers, autoStart } }),
    },
  }
);

export default pomodoroModel;

export type PomodoroModel = ContextFrom<typeof pomodoroModel>;
export type PomodoroEvents = EventFrom<typeof pomodoroModel>;
