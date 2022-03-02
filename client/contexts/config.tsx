import { StoreRepository } from '@electron/repositories/store';
import { emptyConfig, ILogger, UserConfig } from '@shared/types';
import React, { createContext, FC, useContext, useEffect, useState } from 'react';
import { useBridge } from './bridge';

interface Config {
  config: UserConfig;
  storeUpdate: StoreRepository<UserConfig>['storeUpdate'];
  storeReset: StoreRepository<UserConfig>['storeReset'];
  loading: boolean;
}

const configContext = createContext<Config>({
  config: emptyConfig,
  storeUpdate() {
    throw new Error('provider not initialised');
  },
  storeReset() {
    throw new Error('provider not initialised');
  },
  loading: true,
});

const { Provider } = configContext;

export const useConfig = (): Config => useContext(configContext);

interface IConfigProvider extends Partial<Config> {
  logger: ILogger;
  children: React.ReactNode;
}

export function ConfigProvider({
  children,
  logger,
  config: configOverride,
}: IConfigProvider): JSX.Element {
  const [config, setConfig] = useState(configOverride ?? emptyConfig);
  const [loading, setLoading] = useState(true);
  const bridge = useBridge();

  useEffect(() => {
    bridge
      .storeRead()
      .then((data) => {
        data.match({
          Ok: setConfig,
          Err: logger.error,
        });
      })
      .then(() => {
        setLoading(false);
      });
  }, [bridge, setLoading, logger]);

  return (
    <Provider
      value={{
        loading,
        config,
        async storeUpdate(data) {
          const res = await bridge.storeUpdate(data);

          res.match({
            Ok: setConfig,
            Err: logger.error,
          });

          return res;
        },
        async storeReset() {
          const res = await bridge.storeReset();

          res.match({
            Ok: setConfig,
            Err: logger.error,
          });

          return res;
        },
      }}
    >
      {children}
    </Provider>
  );
}
