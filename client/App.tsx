import React, { FC } from 'react';
import { render } from 'react-dom';
import { logger } from '@electron/services/logger';
import { useMachine } from '@client/machines';
import {
  AppContext,
  appMachine,
  AppSend,
  AppState,
  defaultAppSettings,
} from '@client/machines/app/appMachine';
import { appOptions } from '@client/machines/app/appOptions';
import axios from 'axios';
import { defaultTimerContext, timerMachine } from '@client/machines/timer/timerMachine';
import { timerOptions } from '@client/machines/timer/timerOptions';
import { ipcRenderer } from '@electron/electron';
import { GlobalStyle } from './styles/GlobalStyle';

// import Greetings from './components/Greetings';

const mainElement = document.createElement('div');
mainElement.setAttribute('id', 'root');
document.body.appendChild(mainElement);

logger.info('client loaded');

const appContext: AppContext = {
  ...defaultAppSettings,
};

const AppMachine: FC = () => {
  const [state, send] = useMachine(appMachine, {
    devTools: true,
    context: appContext,
    ...appOptions({
      actions: {
        runStartHooks: () => {
          console.log('ipc called');
          ipcRenderer.send('slack');
        },
        runEndHooks: () => {},
      },
    }),
  });

  const {
    autoStart: { beforeLongBreak, beforePomo, beforeShortBreak },
  } = state.context;

  return (
    <div style={{ color: 'white' }}>
      {state.matches('pomo') && (
        <Timer appSend={send} appState={state} title="pomodoro" autoStart={beforePomo} />
      )}
      {state.matches('shortBreak') && (
        <Timer appSend={send} appState={state} title="break" autoStart={beforeShortBreak} />
      )}
      {state.matches('longBreak') && (
        <Timer appSend={send} appState={state} title="longBreak" autoStart={beforeLongBreak} />
      )}
    </div>
  );
};

const Timer: FC<{
  appSend: AppSend;
  appState: AppState;
  autoStart: boolean;
  title: string;
}> = ({ appState, appSend, title, autoStart }) => {
  const [state, send] = useMachine(
    timerMachine.withContext({
      ...defaultTimerContext,
      autoStart,
    }),
    {
      devTools: true,
      ...timerOptions({
        actions: {
          completed: () => {
            appSend({ type: 'COMPLETE' });
          },
        },
        delays: {
          ONE_SECOND: 50,
        },
      }),
    }
  );

  return (
    <div style={{ color: 'white' }}>
      {title}
      {state.matches('initial') && (
        <button
          type="button"
          onClick={() => {
            appSend({ type: 'START' });
            send({ type: 'PLAY' });
          }}
        >
          start
        </button>
      )}
      {!state.matches('initial') && (
        <button
          type="button"
          onClick={() => {
            send({ type: 'STOP' });
            appSend({ type: 'STOP' });
          }}
        >
          stop
        </button>
      )}
      {state.matches('counting') && (
        <button type="button" onClick={() => send({ type: 'PAUSE' })}>
          pause
        </button>
      )}
      {state.matches('paused') && (
        <button type="button" onClick={() => send({ type: 'PLAY' })}>
          play
        </button>
      )}
      <div>
        mins: {state.context.timeLeft.mins}
        seconds: {state.context.timeLeft.seconds}
      </div>
    </div>
  );
};

const App: FC = () => (
  <>
    <GlobalStyle />
    <AppMachine />
  </>
);

// logger.info('Client loaded');
render(<App />, mainElement);
