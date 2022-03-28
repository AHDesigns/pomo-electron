import { actorIds, ConfigActorRef, configModel } from '@client/machines';
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
    (c) => c.children[actorIds.CONFIG] as ConfigActorRef | null
  );
  if (!config) {
    throw new Error(
      `programmer error, "config-actor" not found in machine. Actor refs found: "${Array.from(
        main.children.keys()
      ).join(',')}"`
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
