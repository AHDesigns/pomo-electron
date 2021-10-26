import { createModel } from 'xstate/lib/model';

export const timerModel = createModel(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    timerType: 'pomo' as TimerType,
    autoStart: false,
    duration: 1,
    timeLeft: { mins: 0, seconds: 0 },
  },
  {
    events: {
      play: () => ({}),
      pause: () => ({}),
      stop: () => ({}),
      complete: () => ({}),
    },
    actions: {
      setTimer: () => ({}),
      decrement1Second: () => ({}),
      tickEvent: () => ({}),
    },
  }
);

export type TimerType = 'break' | 'longBreak' | 'pomo';
