import React from 'react';
import { render } from 'react-dom';
import { useMachine } from '@xstate/react';
import machine from '@client/machines/app/machine';
// import { ipcRenderer } from '@electron/electron';
// import { bridgeCreator } from '@electron/ipc/bridgeCreator';
// import { createLogger } from '@electron/services/logger';
// import log from 'electron-log';
// import { App } from './App';
import { inspect } from '@xstate/inspect';

inspect({
  // options
  // url: 'https://statecharts.io/inspect', // (default)
  iframe: false, // open in new window
});

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

render(<App />, mainElement);

function App(): JSX.Element {
  return <Login />;
}

function LoginMachine(): JSX.Element {
  useMachine(machine, {
    devTools: true,
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

function Login(): JSX.Element {
  return (
    <>
      {/* <Inspector /> */}
      <LoginMachine />
    </>
  );
}
