import { Box, Button, TimerProgress } from '@client/components';
import T from '@client/copy';
import { TimerActorRef } from '@client/machines';
import { displayNum } from '@shared/format';
import { useActor } from '@xstate/react';
import React from 'react';
import './countdown.css';

export interface ICountdown {
  timerRef: TimerActorRef;
  title: string;
  duration: number;
}

export function Countdown({ timerRef, title, duration }: ICountdown): JSX.Element {
  const [state, send] = useActor(timerRef);
  const { minutes, seconds, type } = state.context;

  const timerState = (() => {
    if (state.can('START')) {
      return 'inactive';
    }
    if (type === 'pomo') {
      return 'pomo';
    }
    return 'break';
  })();

  return (
    <div className="timer mt-5">
      <Box style={{ gridArea: 'timer' }}>
        <TimerProgress duration={duration} mins={minutes} seconds={seconds} state={timerState} />
      </Box>
      <Box
        style={{
          gridRow: 'top / center',
          gridColumn: 'middle / right',
          justifyContent: 'end',
          fontSize: 14,
        }}
      >
        <p className={`text-center ${type === 'pomo' ? 'text-thmPrimary' : 'text-thmGood'}`}>
          {title}
        </p>
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
              className="animate-pulse"
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
              className="text-thmWarn"
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
            <Button
              className="animate-pulse text-thmGood"
              variant="tertiary"
              onClick={() => send({ type: 'PLAY' })}
            >
              {T.pomoTimer.play}
            </Button>
          )}
        </Box>
      </Box>
    </div>
  );
}
