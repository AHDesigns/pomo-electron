import { assign } from 'xstate';
import merge from 'lodash.merge';
import { TimerOptions } from './timerMachine';

const timerOptionsDefaults: TimerOptions = {
  guards: {
    isComplete: ({ timeLeft: { mins, seconds } }) => mins === 0 && seconds === 1,
  },
  actions: {
    tickEvent: () => {},
    resetTimer: assign({
      timeLeft: ({ duration }) => ({ mins: duration, seconds: 0 }),
    }),
    decrement1Second: assign({
      timeLeft: ({ timeLeft: { mins, seconds } }) =>
        seconds === 0 ? { mins: mins - 1, seconds: 59 } : { mins, seconds: seconds - 1 },
    }),
    completed: () => {},
  },
  delays: {
    // ONE_SECOND: 1000,
  },
  services: {
    count1Second: async () => {},
  },
};

interface Overrides {
  actions?: Pick<TimerOptions['actions'], 'completed' | 'tickEvent'>;
  delays?: TimerOptions['delays'];
  services?: TimerOptions['services'];
}

export const timerOptions = (overrides?: Overrides): TimerOptions =>
  merge({}, timerOptionsDefaults, overrides);
