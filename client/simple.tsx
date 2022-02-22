import React from 'react';
import { render } from 'react-dom';
import { useActor, useMachine } from '@xstate/react';
import machine from '@client/machines/app/machine';
// import { ipcRenderer } from '@electron/electron';
// import { bridgeCreator } from '@electron/ipc/bridgeCreator';
// import { createLogger } from '@electron/services/logger';
// import log from 'electron-log';
// import { App } from './App';
import { inspect } from '@xstate/inspect';
import { TimerActor } from './machines/app/model';

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
  const [state] = useMachine(machine, {
    devTools: true,
    // ...loginOptions(bridge),
    // /* eslint-disable */
    // // turning these off allows clicking through the state machine in storybook
    // services: {} as any,
    // actions: {} as any,
    // /* eslint-enable */
    // devTools: true,
  });

  const x = state.context.pomodoro.active;

  return <p>{x ? <Child child={x} /> : 'hello'}</p>;
}

function Child({ child }: { child: TimerActor }): JSX.Element {
  const [state] = useActor(child);

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
