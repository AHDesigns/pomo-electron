import { ContextFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const timerModel = createModel(
  {
    minutes: 0,
    seconds: 0,
  },
  {
    events: {
      TICK: () => ({}),
      BUMP: () => ({}),
      PAUSE: () => ({}),
      PLAY: () => ({}),
    },
  }
);

export type TimerContext = ContextFrom<typeof timerModel>;

export default timerModel;
