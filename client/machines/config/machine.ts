import { DeepPartial, emptyConfig, IBridge, UserConfig } from '@shared/types';
import { ActorRefFrom, ContextFrom, EventFrom, InterpreterFrom, sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import mainModel from '../main/model';

export const configModel = createModel(emptyConfig, {
  events: {
    'done.invoke.loadConfig': (config: UserConfig) => ({ data: config }),
    RESET: () => ({}),
    UPDATE: (data: DeepPartial<UserConfig>) => ({ data }),
  },
});

export type ConfigContext = ContextFrom<typeof configModel>;
export type ConfitEvents = EventFrom<typeof configModel>;

export interface IConfigMachine {
  bridge: IBridge;
}

export default function configMachine({ bridge }: IConfigMachine) {
  return configModel.createMachine(
    {
      id: 'config',
      initial: 'loading',
      schema: {
        context: {} as ConfigContext,
        events: {} as ConfitEvents,
      },
      context: configModel.initialContext,
      states: {
        loading: {
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
          entry: [sendParent((c) => mainModel.events.CONFIG_LOADED(c))],
        },
      },
    },
    {
      services: {
        loadConfig: async () =>
          bridge.storeRead().then((r) =>
            r.match({
              Ok: (config) => config,
              Err: (e) => {
                bridge.warn(e);
                throw new Error();
              },
            })
          ),
      },
      actions: {
        storeConfig: configModel.assign((c, e) =>
          e.type === 'done.invoke.loadConfig' ? e.data : c
        ),
      },
    }
  );
}

type ConfigMachine = ReturnType<typeof configMachine>;

export type ConfigService = InterpreterFrom<ConfigMachine>;

export type ConfigActorRef = ActorRefFrom<ConfigMachine>;
