import React from 'react';
import { render } from 'react-dom';
import { useActor, useInterpret, useMachine, useSelector } from '@xstate/react';
import machine, { timerMachine, timerModel } from '@client/machines/pomodoro/machine';
// import { ipcRenderer } from '@electron/electron';
// import { bridgeCreator } from '@electron/ipc/bridgeCreator';
// import { createLogger } from '@electron/services/logger';
// import log from 'electron-log';
// import { App } from './App';
import { inspect } from '@xstate/inspect';
import { ActorRef, ActorRefFrom } from 'xstate';
// import { TimerActor } from './machines/app/model';

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
  const service = useInterpret(timerMachine.withContext({ minutes: 2, seconds: 0 }), {
    devTools: true,
    // ...loginOptions(bridge),
    // /* eslint-disable */
    // // turning these off allows clicking through the state machine in storybook
    // services: {} as any,
    // actions: {} as any,
    // /* eslint-enable */
    // devTools: true,
  });

  // const x = state.context;
  // const x = { minutes: 3, seconds: 2 };

  return <Child service={service as any} />;
  // return (
  //   <div>
  //     <p>{m}</p>
  //     <p>{s}</p>
  //   </div>
  // );

  // return <p>{x ? <Child child={x} /> : 'hello'}</p>;
}

type TimerService = ActorRefFrom<typeof timerMachine>;

function Child({ service }: { service: TimerService }): JSX.Element {
  const m = useSelector(service, (y) => y.context.minutes);
  const s = useSelector(service, (y) => y.context.seconds);
  const match = useSelector(service, (y) => y.matches);

  return (
    <div>
      <p>{m}</p>
      <p>{s}</p>
      {match('counting') && <p>counting</p>}
      <button
        type="button"
        onClick={() => {
          service.send(timerModel.events.BUMP());
        }}
      >
        up!
      </button>
    </div>
  );
}

function Login(): JSX.Element {
  return (
    <>
      {/* <Inspector /> */}
      <React.StrictMode>
        <LoginMachine />
      </React.StrictMode>
    </>
  );
}
