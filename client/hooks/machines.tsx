/* eslint-disable @typescript-eslint/consistent-type-assertions, @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type */
import {
  actorIds,
  mainMachine,
  MainService,
  PomodoroActorRef,
  TimerActorRef,
  ConfigActorRef,
  configModel,
  PomodoroService,
  ConfigService,
} from '@client/machines';
import { TimerSettingsActorRef, TimerSettingsService } from '@client/machines/timerSettings/machine';
import { TimerHooks, DeepPartial, UserConfig } from '@shared/types';
import { useActor, useInterpret, useSelector } from '@xstate/react';
import React, { createContext, useContext, useEffect } from 'react';
import { Interpreter } from 'xstate';
import { useBridge } from './bridge';

const machinesConfig = createContext<MainService | null>(null);

const { Provider } = machinesConfig;

export interface IMachinesProvider {
  children: React.ReactNode;
  hooks: TimerHooks;
}

export function MachinesProvider({ children, hooks }: IMachinesProvider): JSX.Element {
  const bridge = useBridge();

  useEffect(() => {
    bridge.info('client starting');
  }, [bridge]);

  const main = useInterpret(
    mainMachine({
      bridge,
      actions: hooks,
      pomodoro: {},
    }),
    {
      devTools: true,
    }
  );

  return <Provider value={main}>{children}</Provider>;
}

export const useMachines = (): MainService => {
  const context = useContext(machinesConfig);
  if (!context) {
    throw new Error('useMachines used without Provider');
  }
  return context;
};

const usePomodoroService = (): PomodoroActorRef => {
  const main = useMachines();
  const pomodoro = useSelector(main, (c) => c.children[actorIds.POMODORO] as PomodoroActorRef | null);

  if (!pomodoro) throw new ActorError(main, actorIds.POMODORO);
  return pomodoro;
};

const useConfigService = (): ConfigActorRef => {
  const main = useMachines();
  const config = useSelector(main, (c) => c.children[actorIds.CONFIG] as ConfigActorRef | null);
  
  if (!config) throw new ActorError(main, actorIds.CONFIG);
  return config;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const usePomodoro = () => {
  const service = usePomodoroService();
  return useActor(service);
};

export const useTimer = (): TimerActorRef | null => {
  const pomodoro = usePomodoroService();

  const timer = useSelector(pomodoro, (c) => c.children[actorIds.TIMER] as TimerActorRef | null);

  return timer;
};


export const useTimerSettings = () => {
  const config = useConfigService();
  const settings = useSelector(config, (c) => c.children[actorIds.TIMER_SETTINGS] as TimerSettingsActorRef | null);

  if (!settings) throw new ActorError(config, actorIds.TIMER_SETTINGS);

  return useActor(settings);
};

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
  const config = useConfigService();

  const [state, send] = useActor(config);

  return {
    storeUpdate: (newConfig) => {
      send(configModel.events.UPDATE(newConfig));
    },
    storeReset: () => {
      send(configModel.events.RESET());
    },
    ...(state.hasTag('loading')
      ? { loading: true, config: null }
      : { loading: false, config: state.context }),
  };
};

type ActorsWithChildren = ConfigActorRef | MainService | PomodoroActorRef;

class ActorError extends Error {
  constructor(actor: ActorsWithChildren, id: keyof typeof actorIds) {
    const msg = `programmer error, "${id}}" not found in machine. Actor refs found: "${Array.from(
      (actor as MainService).children.keys()
    ).join(',')}"`;

    super(msg);
  }
}
