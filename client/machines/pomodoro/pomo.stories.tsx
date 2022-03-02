import React, { useEffect } from 'react';
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

function Child({ service }: { service: any }): JSX.Element {
  const context = useSelector(service, (s) => s.context);
  const matches = useSelector(service, (s) => s.matches);

  return <code>{JSON.stringify(context, null, 2)}</code>;
}

export function TimerMachine(): JSX.Element {
  const service = useInterpret(timerMachine.withContext({ minutes: 2, seconds: 0 }), {
    devTools: true,
  });

  return <Child service={service} />;
}
export function PomoMachine(): JSX.Element {
  const service = useInterpret(machine({ context: { pomodoro: { active: { minutes: 3 } } } }), {
    devTools: true,
  });
  // matches('counting');
  useEffect(() => {
    service.onTransition((c, e) => {
      console.log({ c, e });
    });
  }, []);

  return <Child service={service} />;
}
