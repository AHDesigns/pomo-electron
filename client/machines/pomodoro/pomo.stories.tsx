import React, { useEffect } from 'react';
import { useMachine, useSelector, useInterpret, useActor } from '@xstate/react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { inspect } from '@xstate/inspect';
import machine, { TimerActorRef } from './machine';

inspect({
  iframe: false,
});

export default {
  title: 'Machines/Pomo',
} as Meta;

function Child({ service }: { service: any }): JSX.Element {
  const context = useSelector(service, (s) => s.context);
  const timerRef = useSelector(service, (c) => c.children['timer-actor'] as TimerActorRef);

  return (
    <>
      <p>parent</p>
      <code>{JSON.stringify(context, null, 2)}</code>
      {timerRef && <Actor actorRef={timerRef} />}
    </>
  );
}

function Actor({ actorRef }: { actorRef: TimerActorRef }): JSX.Element {
  const [state] = useActor(actorRef);

  return (
    <>
      <p>child</p>
      <code>{JSON.stringify({ value: state.value, context: state.context }, null, 2)}</code>
    </>
  );
}

export function PomoMachine(): JSX.Element {
  const service = useInterpret(
    machine({
      context: {
        timers: {
          pomo: 1,
        },
      },
      actions: {
        onStartHook: () => {},
        onTickHook: () => {},
        onPauseHook: () => {},
        onPlayHook: () => {},
        onStopHook: () => {},
        onCompleteHook: () => {},
      },
    }),
    {
      devTools: true,
    }
  );

  return <Child service={service} />;
}
