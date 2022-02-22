/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { createModel } from 'xstate/lib/model';
import { ActorRefFrom, createMachine, sendParent } from 'xstate';
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

interface AppModel {
  pomodoro: {
    settings: {
      minutes: number;
      seconds: number;
    };
    active?: TimerActor;
    completed: {
      pomos: number;
      short: number;
      long: number;
    };
    autoStart: {
      pomo: boolean;
      short: boolean;
      long: boolean;
    };
  };
  adhocTimers: AdhocTimer[];
  integrations: {
    slack?: Slack;
    notifications: {
      enabled: boolean;
    };
  };
}

const appInit: AppModel = {
  pomodoro: {
    settings: {
      minutes: 25,
      seconds: 0,
    },
    completed: {
      pomos: 0,
      short: 0,
      long: 0,
    },
    autoStart: {
      pomo: false,
      short: true,
      long: true,
    },
  },
  adhocTimers: [],
  integrations: {
    notifications: {
      enabled: true,
    },
  },
};
/**
 * App Model
 * Contains all global state and events exposed to the application
 *
 * experimenting with this, as trying to access nested actors is proving difficult
 * in theory this machine should defer to other actors, and is just responsible for marshalling events
 */
const appModel = createModel(appInit, {
  events: {
    /**
     * User event to view another page
     * */
    view: (page: 'settings' | 'timers') => ({ page }),

    startPomo: () => ({}),
    pausePomo: () => ({}),
    stopPomo: () => ({}),

    setPomoTimer: (minutes: number) => ({ minutes }),
  },
});

export default appModel;

// const chat: any = sendParent<{ x: number }>((ctx) => appModel.events.startPomo());

const timerModel = createModel(
  {
    happy: true,
    count: 3,
  },
  {
    events: {
      jog: (lol: string) => ({ lol }),
    },
  }
);

export const timerMachine = timerModel.createMachine({
  initial: 'happy',
  states: {
    happy: {
      always: {
        target: 'comp',
        actions: sendParent(appModel.events.pausePomo()),
      },
    },
    comp: {},
  },
});

export type TimerActor = ActorRefFrom<typeof timerMachine>;
// StateMachine
