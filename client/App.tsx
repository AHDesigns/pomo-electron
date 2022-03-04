import { useActor, useInterpret, useSelector } from '@xstate/react';
import T from '@client/copy';
import React, { useEffect, useState } from 'react';
import { displayNum } from '@shared/format';
import { useConfig } from './contexts';
import { PomodoroMachine, pomodoroMachine } from './machines';
import { IPomodoroMachine, TimerActorRef } from './machines/pomodoro/machine';

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

function Timer({
  timerRef,
  service,
}: {
  timerRef: TimerActorRef;
  service: PomodoroMachine;
}): JSX.Element {
  const [state, send] = useActor(timerRef);
  const { pomo, long } = useSelector(service, (c) => c.context.completed);
  const { minutes, seconds } = state.context;

  const timerRunning = state.matches('playing');
  const timerPaused = state.matches('paused');
  const timerReady = state.matches('ready');

  return (
    <div>
      <p>
        {displayNum(minutes)} : {displayNum(seconds)}
      </p>
      {timerReady && (
        <button
          type="button"
          onClick={() => {
            send('START');
          }}
        >
          {T.pomoTimer.start}
        </button>
      )}
      {timerRunning && (
        <button
          type="button"
          onClick={() => {
            send('PAUSE');
          }}
        >
          {T.pomoTimer.pause}
        </button>
      )}
      {timerPaused && (
        <button
          type="button"
          onClick={() => {
            send('PLAY');
          }}
        >
          {T.pomoTimer.play}
        </button>
      )}
      {state.can('STOP') && (
        <button
          type="button"
          onClick={() => {
            send('STOP');
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

interface IPomodoro {
  service: PomodoroMachine;
}

function Pomodoro({ service }: IPomodoro): JSX.Element | null {
  const timerRef = useSelector(service, (c) => c.children['timer-actor'] as TimerActorRef | null);

  return timerRef ? <Timer timerRef={timerRef} service={service} /> : null;
}
