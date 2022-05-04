import { ContextFrom, EventFrom } from 'xstate';
import { createModel } from 'xstate/lib/model';

const timerSettingsModel = createModel(
  {
    pomo: 1,
    short: 1,
    long: 1,
  },
  {
    events: {
      UPDATE: (key: 'long' | 'pomo' | 'short', value: number) => ({ data: { key, value } }),
      CANCEL: () => ({}),
    },
  }
);

export type TimerSettingsContext = ContextFrom<typeof timerSettingsModel>;
export type TimerSettingsEvents = EventFrom<typeof timerSettingsModel>;

export default timerSettingsModel;
