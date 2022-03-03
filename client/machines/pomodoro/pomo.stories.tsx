import React, { useEffect } from 'react';
import { useMachine, useSelector, useInterpret } from '@xstate/react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { inspect } from '@xstate/inspect';
import machine from './machine';

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

export function PomoMachine(): JSX.Element {
  const service = useInterpret(machine({ context: { timers: { pomo: 2 } } }), {
    devTools: true,
  });

  useEffect(() => {
    service.onTransition((c, e) => {
      switch (e.type) {
        case 'PLAY':
          console.log('play', c.value);
          break;
        case 'STOP':
          console.log('stop', c.value);
          break;
        default:
          break;
      }
    });
  }, [service]);

  // matches('counting');
  // useEffect(() => {
  //   service.onTransition((c, e) => {
  //     // console.log({ c, e });
  //   });
  // }, []);

  return <Child service={service} />;
}
