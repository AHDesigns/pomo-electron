import { emptyConfig } from '@shared/types';
import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { TimerContext } from '../timer/model';

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
      CONFIG_LOADED: (
        timers: typeof emptyConfig.timers,
        autoStart: typeof emptyConfig.autoStart
      ) => ({ data: { timers, autoStart } }),
      TIMER_COMPLETE: (data: TimerContext) => ({ data }),
      TIMER_STOPPED: (data: TimerContext) => ({ data }),
      TIMER_START: (data: TimerContext) => ({ data }),
      TIMER_TICK: (data: TimerContext) => ({ data }),
      TIMER_PLAY: (data: TimerContext) => ({ data }),
      TIMER_PAUSE: (data: TimerContext) => ({ data }),
    },
  }
);

export default pomodoroModel;

export type PomodoroModel = ContextFrom<typeof pomodoroModel>;
export type PomodoroEvents = EventFrom<typeof pomodoroModel>;
