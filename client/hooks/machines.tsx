import React, { createContext, useContext } from 'react';
import { useInterpret, useSelector } from '@xstate/react';
import { mainMachine, MainService, PomodoroActorRef, TimerActorRef } from '@client/machines';
import { IBridge, TimerHooks } from '@shared/types';
import { ActorRef } from 'xstate';

const machinesConfig = createContext<MainService | null>(null);

const { Provider } = machinesConfig;

export const useMachines = (): MainService => {
  const context = useContext(machinesConfig);
  if (!context) {
    throw new Error('useMachines used without Provider');
  }
  return context;
};

export interface IMachinesProvider {
  children: React.ReactNode;
  hooks: TimerHooks;
  bridge: IBridge;
}

export function MachinesProvider({ children, hooks, bridge }: IMachinesProvider): JSX.Element {
  const main = useInterpret(
    mainMachine({
      pomodoro: {
        actions: {
          ...hooks,
        },
      },
      bridge,
    }),
    {
      devTools: true,
    }
  );

  return <Provider value={main}>{children}</Provider>;
}

export const usePomodoro = (): PomodoroActorRef => {
  const main = useMachines();
  const pomodoro = useSelector(
    main,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (c) => c.children['pomodoro-actor'] as PomodoroActorRef | null
  );

  if (!pomodoro) {
    throw new Error(
      `programmer error, "pomodoro-actor" not found in machine. Actor refs found: "${Object.keys(
        main.children
      ).join(', ')}"`
    );
  }
  return pomodoro;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nullActor: ActorRef<any, any> = {
  id: 'null',
  send: () => {},
  subscribe: () => ({ unsubscribe: () => {} }),
  getSnapshot: () => {},
  [Symbol.observable]: () => ({
    subscribe: () => ({ unsubscribe: () => {} }),
  }),
};

export const useTimer = (): TimerActorRef | null => {
  const pomodoro = usePomodoro();

  const timer = useSelector(
    // pomodoro ?? (nullActor as PomodoroActorRef),
    pomodoro,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    (c) => c.children['timer-actor'] as TimerActorRef | null
  );

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
