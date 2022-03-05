import React from 'react';
import T from '@client/copy';
import { usePomodoro, useTimer } from '@client/hooks';
import { TimerActorRef } from '@client/machines';
import { displayNum } from '@shared/format';
import { useActor } from '@xstate/react';

export function Pomodoro(): JSX.Element | null {
  const pomodoro = usePomodoro();
  const timerRef = useTimer();

  const [state] = useActor(pomodoro);

  const { pomo, long } = state.context.completed;

  return timerRef ? <Timer timerRef={timerRef} long={long} pomo={pomo} /> : null;
}

interface ITimer {
  timerRef: TimerActorRef;
  pomo: number;
  long: number;
}

function Timer({ timerRef, long, pomo }: ITimer): JSX.Element {
  const [state, send] = useActor(timerRef);
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
