/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'xstate/lib/model';
import { ActorRefFrom, sendParent } from 'xstate';
import { none, Option } from '@shared/Option';

interface Slack {
  token?: string;
  cookieD?: string;
  cookieDS?: string;
}

interface AdhocTimer {
  minutes: 10;
  seconds: 0;
}

/**
 * App Model
 * Contains all global state and events exposed to the application
 *
 * experimenting with this, as trying to access nested actors is proving difficult
 * in theory this machine should defer to other actors, and is just responsible for marshalling events
 */
const appModel = createModel(
  {
    pomodoro: {
      settings: {
        minutes: 25,
        seconds: 0,
        autoStart: {
          pomo: false,
          short: true,
          long: true,
        },
      },
      completed: {
        pomos: 0,
        short: 0,
        long: 0,
      },
      active: {
        minutes: 25,
        seconds: 0,
      },
    },
    adhocTimers: [] as AdhocTimer[],
    integrations: {
      notifications: {
        enabled: true,
      },
      slack: null as Slack | null,
    },
  },
  {
    events: {
      POMO_PLAY: () => ({}),
      POMO_PAUSE: () => ({}),
      POMO_STOP: () => ({}),

      SETTINGS_POMO_SET: (minutes: number) => ({ minutes }),
    },
  }
);

export default appModel;

// const timerModel = createModel(
//   {
//     happy: true,
//     count: 3,
//   },
//   {
//     events: {
//       jog: (lol: string) => ({ lol }),
//     },
//   }
// );

// export const timerMachine = timerModel.createMachine({
//   initial: 'happy',
//   states: {
//     happy: {
//       always: {
//         target: 'comp',
//         actions: sendParent(appModel.events.pausePomo()),
//       },
//     },
//     comp: {},
//   },
// });

// export type TimerActor = ActorRefFrom<typeof timerMachine>;
// StateMachine
