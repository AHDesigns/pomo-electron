/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'xstate/lib/model';

// interface Slack {
//   token?: string;
//   cookieD?: string;
//   cookieDS?: string;
// }

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
        minutes: 0,
        seconds: 0,
      },
    },
    adhocTimers: [] as AdhocTimer[],
  },
  {
    events: {
      POMO_PLAY: () => ({}),
      POMO_PAUSE: () => ({}),
      POMO_STOP: () => ({}),
    },
    actions: {
      onStartHooks: () => ({}),
      onTickHooks: () => ({}),
      onPauseHooks: () => ({}),
      onPlayHooks: () => ({}),
      onStopHooks: () => ({}),
    },
  }
);

export default pomodoroModel;
