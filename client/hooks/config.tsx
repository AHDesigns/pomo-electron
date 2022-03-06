import { ConfigActorRef, configModel } from '@client/machines';
import { DeepPartial, emptyConfig, UserConfig } from '@shared/types';
import { useActor, useSelector } from '@xstate/react';
import React, { createContext, useEffect, useState } from 'react';
import { useBridge } from './bridge';
import { useLogger } from './logger';
import { useMachines } from './machines';

interface ConfigUpdaters {
  storeUpdate(config: DeepPartial<UserConfig>): void;
  storeReset(): void;
}

interface ConfigLoaded extends ConfigUpdaters {
  config: UserConfig;
  loading: false;
}
interface ConfigLoading extends ConfigUpdaters {
  config: null;
  loading: true;
}

type ConfigMaybe = ConfigLoaded | ConfigLoading;

export const useConfig = (): ConfigMaybe => {
  const main = useMachines();
  const config = useSelector(
    main,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (c) => c.children['config-actor'] as ConfigActorRef | null
  );
  if (!config) {
    throw new Error(
      `programmer error, "config-actor" not found in machine. Actor refs found: "${Object.keys(
        main.children
      ).join(', ')}"`
    );
  }

  const [state, send] = useActor(config);

  return {
    storeUpdate: (newConfig) => {
      send(configModel.events.UPDATE(newConfig));
    },
    storeReset: () => {
      send(configModel.events.RESET());
    },
    ...(state.matches('loading')
      ? { loading: true, config: null }
      : { loading: false, config: state.context }),
  };
};

// const configContext = createContext<ConfigMaybe>({
//   config: emptyConfig,
//   storeUpdate() {
//     throw new Error('provider not initialised');
//   },
//   storeReset() {
//     throw new Error('provider not initialised');
//   },
//   loading: true,
// });

// const { Provider } = configContext;

// export const useConfig = (): Config => useContext(configContext);

// interface IConfigProvider extends Partial<ConfigUpdaters> {
//   children: React.ReactNode;
// }

//   export function ConfigProvider(): JSX.Element {
//   return null
// }

// export function ConfigProvider({ children, config: configOverride }: IConfigProvider): JSX.Element {
//   const logger = useLogger();
//   const [config, setConfig] = useState(configOverride ?? emptyConfig);
//   const [loading, setLoading] = useState(true);
//   const bridge = useBridge();

//   useEffect(() => {
//     bridge
//       .storeRead()
//       .then((data) => {
//         data.match({
//           Ok: setConfig,
//           Err: logger.error,
//         });
//       })
//       .then(() => {
//         setLoading(false);
//       });
//   }, [bridge, setLoading, logger]);

//   return (
//     <Provider
//       value={{
//         loading,
//         config,
//         async storeUpdate(data) {
//           const res = await bridge.storeUpdate(data);

//           res.match({
//             Ok: setConfig,
//             Err: logger.error,
//           });

//           return res;
//         },
//         async storeReset() {
//           const res = await bridge.storeReset();

//           res.match({
//             Ok: setConfig,
//             Err: logger.error,
//           });

//           return res;
//         },
//       }}
//     >
//       {children}
//     </Provider>
//   );
// }
