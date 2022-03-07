import { Inspector } from '@client/components';
import { Meta } from '@storybook/react/types-6-0';
import { useMachine } from '@xstate/react';
import React from 'react';
import machine from './machine';

export default {
  title: 'Machines/View',
} as Meta;

function LoginMachine(): JSX.Element {
  const [context, send] = useMachine(machine, {
    devTools: true,
  });

  return <p>hello</p>;
}

export function Login(): JSX.Element {
  return (
    <>
      <Inspector />
      <LoginMachine />
    </>
  );
}
