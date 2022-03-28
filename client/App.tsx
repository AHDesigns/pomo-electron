import React from 'react';
import { PageManager } from '@client/components';
import { inspect } from '@xstate/inspect';
import { useSelector } from '@xstate/react';
import { useMachines } from './hooks/machines';

inspect({
  url: 'https://statecharts.io/inspect',
  iframe: false,
});

export function App(): JSX.Element {
  const main = useMachines();
  const loaded = useSelector(main, (c) => c.context.loaded);

  // annoying workaround to make sure all child actors are ready
  if (!loaded) {
    return <p>...booting</p>;
  }
  return <PageManager />;
}
