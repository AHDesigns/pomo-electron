import React, { FC } from 'react';
import { useMachine, useSelector, useInterpret } from '@xstate/react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { inspect } from '@xstate/inspect';
import machine, { timerMachine, TimerContext } from './machine';

inspect({
  iframe: false,
});

export default {
  title: 'Machines/Pomo',
} as Meta;

function Child({ context }: { context: TimerContext }): JSX.Element {
  return <p>{JSON.stringify(context)}</p>;
}

export function PomoMachine(): JSX.Element {
  const service = useInterpret(timerMachine.withContext({ minutes: 2, seconds: 0 }), {
    devTools: true,
  });
  const context = useSelector(service, (s) => s.context);

  return <Child context={context} />;
}
