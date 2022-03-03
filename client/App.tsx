import { useInterpret, useSelector } from '@xstate/react';
import T from '@client/copy';
import React, { useEffect, useState } from 'react';
import { displayNum } from '@shared/format';
import { useConfig } from './contexts';
import { PomodoroMachine, pomodoroMachine } from './machines';

interface Hook {
  (x: any): void;
}

export interface IApp {
  hooks?: {
    start: Hook;
    tick: Hook;
    pause: Hook;
    play: Hook;
    stop: Hook;
  };
}

export function App({ hooks }: IApp): JSX.Element {
  const { config } = useConfig();
  const service = useInterpret(
    pomodoroMachine({
      context: {
        timers: config.timers,
        autoStart: config.autoStart,
      },
    })
  );

  useEffect(() => {
    service.onTransition((c, e) => {
      const { minutes: mins, seconds } = c.context.active;
      // eslint-disable-next-line
      const timer: string = (c.value as any)?.pomodoro ?? 'pomo';

      type X = keyof Required<IApp>['hooks'];
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const event = e.type.toLowerCase().replace('_', '') as X;
      if (hooks && event in hooks) {
        // console.log({ timer, mins, seconds, e });
        hooks[event]({ mins, seconds, timer });
      }
      // switch (e.type) {
      //   case 'START':
      //     hooks?.start({ mins, seconds, timer });
      //     break;
      //   default:
      //     break;
      // }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Pomodoro service={service} />;
}

interface IPomodoro {
  service: PomodoroMachine;
}

function Pomodoro({ service }: IPomodoro): JSX.Element {
  const { seconds, minutes } = useSelector(service, (c) => c.context.active);
  const { pomo, long } = useSelector(service, (c) => c.context.completed);
  const state = useSelector(service, (c) => c);

  const timerRunning = useSelector(service, (c) => c.matches('timer.playing'));
  const timerPaused = useSelector(service, (c) => c.matches('timer.paused'));
  const timerReady = useSelector(service, (c) => c.matches('timer.ready'));

  return (
    <div>
      <p>
        {displayNum(minutes)} : {displayNum(seconds)}
      </p>
      {timerReady && (
        <button
          type="button"
          onClick={() => {
            service.send('START');
          }}
        >
          {T.pomoTimer.start}
        </button>
      )}
      {timerRunning && (
        <button
          type="button"
          onClick={() => {
            service.send('PAUSE');
          }}
        >
          {T.pomoTimer.pause}
        </button>
      )}
      {timerPaused && (
        <button
          type="button"
          onClick={() => {
            service.send('PLAY');
          }}
        >
          {T.pomoTimer.play}
        </button>
      )}
      {state.can('STOP') && (
        <button
          type="button"
          onClick={() => {
            service.send('STOP');
          }}
        >
          {T.pomoTimer.stop}
        </button>
      )}
      <p>completed pomos: {pomo}</p>
      <p>completed breaks: {long}</p>
    </div>
  );
}
