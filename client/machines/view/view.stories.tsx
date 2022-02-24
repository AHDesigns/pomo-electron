import React, { FC } from 'react';
import { useMachine } from '@xstate/react';
import { Story, Meta } from '@storybook/react/types-6-0';
// import { Inspector } from '@client/components';
import { inspect } from '@xstate/inspect';
import machine from './machine';

inspect({
  iframe: false,
});

export default {
  title: 'Machines/View',
} as Meta;

function LoginMachine(): JSX.Element {
  useMachine(machine, {
    devTools: true,
  });

  return <p>hello</p>;
}

export function Login(): JSX.Element {
  return (
    <>
      {/* <Inspector /> */}
      <LoginMachine />
    </>
  );
}
