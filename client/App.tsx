import { useInterpret, useSelector } from '@xstate/react';
import T from '@client/copy';
import React, { useEffect, useState } from 'react';
import { displayNum } from '@shared/format';
import { useConfig } from './contexts';
import { PomodoroMachine, pomodoroMachine } from './machines';
import { IPomodoroMachine } from './machines/pomodoro/machine';

export interface IApp {
  hooks: IPomodoroMachine['actions'];
}

export function App({ hooks }: IApp): JSX.Element {
  const { config } = useConfig();
  const service = useInterpret(
    pomodoroMachine({
      context: {
        timers: config.timers,
        autoStart: config.autoStart,
      },
      actions: {
        ...hooks,
      },
    })
  );

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
      {(timerRunning || timerPaused) && (
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
