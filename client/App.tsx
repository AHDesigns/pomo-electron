import { PageManager } from '@client/components';
import { inspect } from '@xstate/inspect';
import React from 'react';

inspect({
  url: 'https://statecharts.io/inspect',
  iframe: false,
});

export function App(): JSX.Element {
  return <PageManager />;
}
