import React from 'react';
import { useActor } from '@xstate/react';
import T from '@client/copy';
import { displayNum } from '@shared/format';
import { Box, Button, TimerProgress } from '@client/components';
import { TimerActorRef } from '@client/machines';
import './countdown.css';

export interface ICountdown {
  timerRef: TimerActorRef;
  title: string;
  duration: number;
}

export function Countdown({ timerRef, title, duration }: ICountdown): JSX.Element {
  const [state, send] = useActor(timerRef);
  const { minutes, seconds } = state.context;

  return (
    <div className="timer">
      <Box style={{ gridArea: 'timer' }}>
        <TimerProgress
          duration={duration}
          mins={minutes}
          seconds={seconds}
          state={state}
          title={title}
        />
      </Box>
      <Box
        style={{
          gridRow: 'top / center',
          gridColumn: 'middle / right',
          justifyContent: 'end',
          fontSize: 14,
        }}
      >
        <p className="text-center text-thmBright">{title}</p>
      </Box>
      <Box
        className="mt-[7px]"
        style={{
          gridRow: 'center / bottom',
          gridColumn: 'middle / right',
          justifyContent: 'start',
        }}
      >
        <p
          style={{
            fontSize: 38,
            textAlign: 'center',
          }}
        >
          {displayNum(minutes)} : {displayNum(seconds)}
        </p>
      </Box>
      <Box style={{ gridArea: 'controls' }}>
        <Box
          style={{
            flexDirection: 'row',
            justifyContent: state.can('START') ? 'center' : 'space-between',
          }}
        >
          {state.can('START') && (
            <Button
              // variant="secondary"
              onClick={() => {
                send({ type: 'START' });
              }}
            >
              {T.pomoTimer.start}
            </Button>
          )}
          {state.can('STOP') && (
            <Button
              variant="tertiary"
              onClick={() => {
                send({ type: 'STOP' });
              }}
            >
              {T.pomoTimer.stop}
            </Button>
          )}
          {state.can('PAUSE') && (
            <Button variant="tertiary" onClick={() => send({ type: 'PAUSE' })}>
              {T.pomoTimer.pause}
            </Button>
          )}
          {state.can('PLAY') && (
            <Button variant="secondary" onClick={() => send({ type: 'PLAY' })}>
              {T.pomoTimer.play}
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
}
