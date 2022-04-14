/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  actorIds,
  mainMachine,
  MainService,
  PomodoroActorRef,
  TimerActorRef,
} from '@client/machines';
import { TimerHooks } from '@shared/types';
import { useActor, useInterpret, useSelector } from '@xstate/react';
import React, { createContext, useContext, useEffect } from 'react';
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
  const pomodoro = useSelector(
    main,
    (c) => c.children[actorIds.POMODORO] as PomodoroActorRef | null
  );

  if (!pomodoro) {
    throw new Error(
      `programmer error, "${
        actorIds.POMODORO
      }}" not found in machine. Actor refs found: "${Array.from(main.children.keys()).join(',')}"`
    );
  }
  return pomodoro;
};

export const usePomodoro = () => {
  const service = usePomodoroService();
  return useActor(service);
};

export const useTimer = (): TimerActorRef | null => {
  const pomodoro = usePomodoroService();

  const timer = useSelector(pomodoro, (c) => c.children[actorIds.TIMER] as TimerActorRef | null);

  return timer;
};

export function createFakeHooks(): TimerHooks {
  return {
    onTickHook: () => {},
    onStartHook: () => {},
    onPauseHook: () => {},
    onPlayHook: () => {},
    onStopHook: () => {},
    onCompleteHook: () => {},
  };
}
