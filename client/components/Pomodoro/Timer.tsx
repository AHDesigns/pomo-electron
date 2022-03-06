import React from 'react';
import { useActor } from '@xstate/react';
import { useTheme } from 'styled-components';
import T from '@client/copy';
import { displayNum } from '@shared/format';
import { Box, TimerProgress } from '@client/components';
import { TimerActorRef } from '@client/machines';
import { Button, TimerGrid, StopButton } from './styles';

export interface ITimer {
  timerRef: TimerActorRef;
  title: string;
  duration: number;
}

export function Timer({ timerRef, title, duration }: ITimer): JSX.Element {
  const [state, send] = useActor(timerRef);
  const { minutes, seconds } = state.context;
  const theme = useTheme();

  return (
    <TimerGrid>
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
          justifyContent: 'flex-end',
        }}
      >
        <p style={{ fontSize: 14, textAlign: 'center', color: theme.palette.bright }}>{title}</p>
      </Box>
      <Box
        style={{
          gridRow: 'center / bottom',
          gridColumn: 'middle / right',
          justifyContent: 'flex-start',
          paddingTop: '2px',
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
              type="button"
              onClick={() => {
                send({ type: 'START' });
              }}
            >
              {T.pomoTimer.start}
            </Button>
          )}
          {state.can('STOP') && (
            <StopButton
              type="button"
              onClick={() => {
                send({ type: 'STOP' });
              }}
            >
              {T.pomoTimer.stop}
            </StopButton>
          )}
          {state.can('PAUSE') && (
            <Button type="button" onClick={() => send({ type: 'PAUSE' })}>
              {T.pomoTimer.pause}
            </Button>
          )}
          {state.can('PLAY') && (
            <Button type="button" onClick={() => send({ type: 'PLAY' })}>
              {T.pomoTimer.play}
            </Button>
          )}
        </Box>
      </Box>
    </TimerGrid>
  );
}
