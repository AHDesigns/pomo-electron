import { emptyConfig, IBridge, UserConfig } from '@shared/types';
import { sendParent } from 'xstate';
import { createModel } from 'xstate/lib/model';
import mainModel from '../main/model';

export const configModel = createModel(emptyConfig, {
  events: {
    'done.invoke.loadConfig': (config: UserConfig) => ({ data: config }),
  },
});

export interface ConfigMachine {
  bridge: IBridge;
}

export default function configMachine({ bridge }: ConfigMachine) {
  return configModel.createMachine(
    {
      id: 'config',
      initial: 'loading',
      context: configModel.initialContext,
      states: {
        loading: {
          invoke: {
            src: 'loadConfig',
            onDone: {
              actions: 'storeConfig',
              target: 'loaded',
            },
            onError: {
              // TODO: maybe some user prompt to let them know?
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
                // eslint-disable-next-line no-console
                console.warn(e);
                throw new Error();
              },
            })
          ),
      },
      actions: {
        storeConfig: configModel.assign((_, { data }) => data),
      },
    }
  );
}
