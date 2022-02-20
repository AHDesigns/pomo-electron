import React, { FC } from 'react';
import { useMachine } from '@xstate/react';
import { Story, Meta } from '@storybook/react/types-6-0';
// import { Inspector } from '@client/components';
import machine from './machine';
// import { IBridge } from '@shared/types';
// import { err, ok } from '@shared/Result';
// import { exampleUser } from '@test/fixtures/github';

export default {
  title: 'Machines/App',
} as Meta;

// const bridge: IBridge = {
//   loadUserConfig: async () => Promise.resolve(err('no store')),
//   error(): void {},
//   info(): void {},
//   openGithubForTokenSetup(): void {},
//   validateAndStoreGithubToken: async () => Promise.resolve(ok(true)),
//   test(): void {},
//   getCurrentUser: async () => Promise.resolve(ok(exampleUser)),
// };

function LoginMachine(): JSX.Element {
  useMachine(machine, {
    // ...loginOptions(bridge),
    // /* eslint-disable */
    // // turning these off allows clicking through the state machine in storybook
    // services: {} as any,
    // actions: {} as any,
    // /* eslint-enable */
    // devTools: true,
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
