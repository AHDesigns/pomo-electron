import { useInterpret, useSelector } from '@xstate/react';
import T from '@client/copy';
import React, { useEffect } from 'react';
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
        pomodoro: {
          active: {
            minutes: config.timers.pomo,
          },
        },
      },
    }).withConfig({
      actions: {
        onStartHooks: (c) => {
          const { seconds, minutes, type } = c.pomodoro.active;
          hooks?.start({
            timer: type,
            mins: minutes,
            seconds,
          });
        },
        onTickHooks: (c) => {
          const { seconds, minutes, type } = c.pomodoro.active;
          hooks?.tick({
            timer: type,
            mins: minutes,
            seconds,
          });
        },
        onPauseHooks: (c) => {
          const { seconds, minutes, type } = c.pomodoro.active;
          hooks?.pause({
            timer: type,
            mins: minutes,
            seconds,
          });
        },
        onPlayHooks: (c) => {
          const { seconds, minutes, type } = c.pomodoro.active;
          hooks?.play({
            timer: type,
            mins: minutes,
            seconds,
          });
        },
        onStopHooks: (c, e) => {
          const { seconds, minutes, type } = c.pomodoro.active;
          hooks?.stop({
            timer: type,
            mins: minutes,
            seconds,
          });
        },
      },
    })
  );

  return <Pomodoro service={service} />;
}

interface IPomodoro {
  service: PomodoroMachine;
}

function Pomodoro({ service }: IPomodoro): JSX.Element {
  const { seconds, minutes } = useSelector(service, (c) => c.context.pomodoro.active);
  const { pomos, long } = useSelector(service, (c) => c.context.pomodoro.completed);
  const state = useSelector(service, (c) => c);

  const timerRunning = useSelector(service, (c) => c.matches('timer.active'));
  const timerPaused = useSelector(service, (c) => c.matches('timer.paused'));
  const timerInactive = useSelector(service, (c) => c.matches('timer.inactive'));

  return (
    <div>
      <p>
        {minutes} : {seconds || '00'}
      </p>
      {timerInactive && (
        <button
          type="button"
          onClick={() => {
            service.send('POMO_START');
          }}
        >
          {T.pomoTimer.start}
        </button>
      )}
      {timerRunning && (
        <button
          type="button"
          onClick={() => {
            service.send('POMO_PAUSE');
          }}
        >
          {T.pomoTimer.pause}
        </button>
      )}
      {timerPaused && (
        <button
          type="button"
          onClick={() => {
            service.send('POMO_START');
          }}
        >
          {T.pomoTimer.play}
        </button>
      )}
      {state.can('POMO_STOP') && (
        <button
          type="button"
          onClick={() => {
            service.send('POMO_STOP');
          }}
        >
          {T.pomoTimer.stop}
        </button>
      )}
      <p>completed pomos: {pomos}</p>
      <p>completed breaks: {long}</p>
    </div>
  );
}
