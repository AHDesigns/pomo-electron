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

export const ConfigProvider: FC<Partial<Config> & { logger: ILogger }> = (props) => {
  const [config, setConfig] = useState(props.config ?? emptyConfig);
  const [loading, setLoading] = useState(true);
  const bridge = useBridge();

  useEffect(() => {
    bridge
      .storeRead()
      .then((data) => {
        data.match({
          Ok: setConfig,
          Err: props.logger.error,
        });
      })
      .then(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Provider
      value={{
        loading,
        config,
        async storeUpdate(data) {
          const res = await bridge.storeUpdate(data);

          res.match({
            Ok: setConfig,
            Err: props.logger.error,
          });

          return res;
        },
        async storeReset() {
          const res = await bridge.storeReset();

          res.match({
            Ok: setConfig,
            Err: props.logger.error,
          });

          return res;
        },
        ...props,
      }}
    >
      {props.children}
    </Provider>
  );
};
