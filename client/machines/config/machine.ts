import { DeepPartial, emptyConfig, IBridge, UserConfig } from '@shared/types';
import { ActorRefFrom, ContextFrom, EventFrom, InterpreterFrom, sendParent, assign } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { actorIds } from '../constants';
import mainModel from '../main/model';
import { timerSettingsFactory } from '../timerSettings/machine';
import { TimerSettingsContext } from '../timerSettings/model';

export const configModel = createModel(emptyConfig, {
  events: {
    RESET: () => ({}),
    UPDATE: (data: DeepPartial<UserConfig>) => ({ data }),
  },
});

export type ConfigContext = ContextFrom<typeof configModel>;
export type ConfitEvents = EventFrom<typeof configModel>;

export interface IConfigMachine {
  bridge: IBridge;
  /**
   * Inject a config as a testing mechanism
   */
  configOverride?: UserConfig;
}

export default function configMachine({ bridge, configOverride }: IConfigMachine) {
  return configModel.createMachine(
    {
      id: 'config',
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as ConfigContext,
        events: {} as ConfitEvents,
        services: {} as {
          loadConfig: { data: UserConfig };
          updateConfig: { data: UserConfig };
          resetConfig: { data: UserConfig };
        },
      },
      context: configModel.initialContext,
      initial: 'loading',
      states: {
        loading: {
          tags: ['loading'],
          invoke: {
            id: 'loadConfig',
            src: 'loadConfig',
            onDone: {
              actions: 'storeConfig',
              target: 'loaded',
            },
            onError: {
              target: 'loaded',
            },
          },
        },
        loaded: {
          type: 'parallel',
          states: {
            settings: {
              invoke: {
                id: actorIds.TIMER_SETTINGS,
                src: (c) => timerSettingsFactory({ context: c.timers }),
              },
            },
            config: {
              initial: 'idle',
              states: {
                idle: {
                  tags: ['idle'],
                  entry: [sendParent((c) => mainModel.events.CONFIG_LOADED(c))],
                  on: {
                    UPDATE: 'updating',
                    RESET: 'resetting',
                  },
                },
                updating: {
                  tags: ['updating'],
                  invoke: {
                    id: 'updateConfig',
                    src: 'updateConfig',
                    onDone: {
                      actions: 'storeConfig',
                      target: 'idle',
                    },
                    onError: {
                      target: 'idle',
                    },
                  },
                },
                resetting: {
                  tags: ['updating'],
                  invoke: {
                    id: 'resetConfig',
                    src: 'resetConfig',
                    onDone: {
                      actions: 'storeConfig',
                      target: 'idle',
                    },
                    onError: {
                      target: 'idle',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      services: {
        loadConfig: async () => {
          if (configOverride) {
            return configOverride;
          }

          const r = await bridge.storeRead();
          return r.match({
            Ok: (config) => config,
            Err: (e) => {
              bridge.warn(e);
              throw new Error();
            },
          });
        },
        resetConfig: async () => {
          const res = await bridge.storeReset();
          return res.match({
            Ok: (config) => config,
            Err: (e) => {
              bridge.warn(e);
              throw new Error();
            },
          });
        },
        updateConfig: async (_, e) => {
          const res = await bridge.storeUpdate(e.data);
          return res.match({
            Ok: (config) => config,
            Err: (er) => {
              bridge.warn(er);
              throw new Error();
            },
          });
        },
      },
      actions: {
        storeConfig: assign((_, { data }) => data),
      },
    }
  );
}

type ConfigMachine = ReturnType<typeof configMachine>;

export type ConfigService = InterpreterFrom<ConfigMachine>;

export type ConfigActorRef = ActorRefFrom<ConfigMachine>;
