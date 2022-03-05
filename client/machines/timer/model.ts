import { ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const timerModel = createModel(
  {
    minutes: 0,
    seconds: 0,
    type: 'pomo' as 'long' | 'pomo' | 'short',
  },
  {
    events: {
      START: () => ({}),
      PLAY: () => ({}),
      PAUSE: () => ({}),
      STOP: () => ({}),
      _TICK: () => ({}),
    },
  }
);

export type TimerContext = ContextFrom<typeof timerModel>;

export default timerModel;
