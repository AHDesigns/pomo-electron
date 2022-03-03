import { emptyConfig } from '@shared/types';
import { ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

interface AdhocTimer {
  minutes: number;
  seconds: number;
}

const pomodoroModel = createModel(
  {
    completed: {
      pomo: 0,
      short: 0,
      long: 0,
    },
    active: {
      minutes: 0,
      seconds: 0,
    },
    timers: emptyConfig.timers,
    autoStart: emptyConfig.autoStart,
    adhocTimers: [] as AdhocTimer[],
  },
  {
    events: {
      START: () => ({}),
      PLAY: () => ({}),
      PAUSE: () => ({}),
      STOP: () => ({}),
      _STOPPED: () => ({}),
      _COMPLETE: () => ({}),
      _TICK: () => ({}),
    },
  }
);

export default pomodoroModel;

export type PomodoroModel = ContextFrom<typeof pomodoroModel>;
// export type PomodoroEvents = EventsFrom<typeof pomodoroModel>;
