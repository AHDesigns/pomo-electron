import { createModel } from 'xstate/lib/model';

export const timerModel = createModel(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    timerType: 'adhoc' as TimerType,
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
type TimerType = 'adhoc' | 'break' | 'longBreak' | 'pomodoro';
