import { emptyConfig } from '@shared/types';
import { ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface AdhocTimer {
  minutes: 10;
  seconds: 0;
}

const pomodoroModel = createModel(
  {
    pomodoro: {
      completed: {
        pomos: 0,
        short: 0,
        long: 0,
      },
      active: {
        type: 'pomo' as 'long' | 'pomo' | 'short',
        minutes: 0,
        seconds: 0,
      },
    },
    timers: emptyConfig.timers,
    autoStart: emptyConfig.autoStart,
    adhocTimers: [] as AdhocTimer[],
  },
  {
    events: {
      POMO_START: () => ({}),
      POMO_PAUSE: () => ({}),
      POMO_STOP: () => ({}),
      TIMER_TICK: (minutes: number, seconds: number) => ({ minutes, seconds }),
      /**
       * Reset the current timer, used because in v4 assign actions get priority (bug), so this allows a workaround
       * */
      RESET: () => ({}),
    },
    actions: {
      onStartHooks: () => ({}),
      onTickHooks: () => ({}),
      onPauseHooks: () => ({}),
      onPlayHooks: () => ({}),
      onStopHooks: () => ({}),
      resetTimerDisplay: () => ({}),
    },
  }
);

export default pomodoroModel;

export type PomodoroModel = ContextFrom<typeof pomodoroModel>;
// export type PomodoroEvents = EventsFrom<typeof pomodoroModel>;
