import React, { FC } from 'react';
import { AppSend } from '@client/machines/app/appMachine';
import { useMachine } from '@client/machines';
import { defaultTimerContext, timerMachine } from '@client/machines/timer/timerMachine';
import { merge } from '@shared/merge';
import { isDev } from '@shared/constants';
import { timerOptions } from '@client/machines/timer/timerOptions';
// import { Button } from '@client/components';
import { Box } from '@client/components';
import styled, { useTheme } from 'styled-components';
import { TimerProgress } from '@client/components';
import { useBridge } from '@client/contexts';

const Button = styled.button`
  width: 50px;
  height: 50px;
  color: ${({ theme }) => theme.palette.primary};
  border: thin solid ${({ theme }) => theme.palette.primary};
  border-radius: 25px;
  background: none;
  outline: none;
  cursor: pointer;

  &:focus {
    color: ${({ theme }) => theme.palette.background};
    background: ${({ theme }) => theme.palette.bright};
  }

  &:hover {
    color: ${({ theme }) => theme.palette.background};
    background: ${({ theme }) => theme.palette.primary};
  }
`;

const StopButton = styled(Button)`
  color: ${({ theme }) => theme.palette.yellow};
  border: thin solid ${({ theme }) => theme.palette.yellow};
`;

const TimerGrid = styled.div`
  display: grid;
  grid-template-columns: [left] 1fr [middle] 160px [right] 1fr;
  grid-template-rows: [top] 60px [center] 100px [bottom] 10px [control] min-content;
  grid-template-areas:
    '. timer .'
    '. timer .'
    '. gap .'
    '. controls .';
`;

export const Timer: FC<{
  appSend: AppSend;
  autoStart: boolean;
  title: 'break' | 'long break' | 'pomodoro';
  duration: number;
  clock: any;
}> = ({ appSend, title, autoStart, duration }) => {
  const bridge = useBridge();
  const [state, send] = useMachine(
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    timerMachine.withContext(
      merge(defaultTimerContext, { autoStart, duration })
    ) as typeof timerMachine,
    {
      devTools: isDev,
      ...timerOptions({
        actions: {
          tickEvent: ({ timeLeft }) => {
            appSend({ type: 'TICK', timeLeft });
          },
          completed: () => {
            appSend({ type: 'COMPLETE' });
          },
        },
      }),
    }
  );

  const { mins, seconds } = state.context.timeLeft;
  const theme = useTheme();

  return (
    <TimerGrid>
      <Box style={{ gridArea: 'timer' }}>
        <TimerProgress
          duration={duration}
          mins={mins}
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
          {mins} : {seconds >= 10 ? seconds : `0${seconds}`}
        </p>
      </Box>
      <Box style={{ gridArea: 'controls' }}>
        <Box
          style={{
            flexDirection: 'row',
            justifyContent: state.matches('initial') ? 'center' : 'space-between',
          }}
        >
          {state.matches('initial') && (
            <Button
              type="button"
              onClick={() => {
                appSend({ type: 'START' });
                send({ type: 'PLAY' });
              }}
            >
              start
            </Button>
          )}
          {!state.matches('initial') && (
            <StopButton
              type="button"
              onClick={() => {
                send({ type: 'STOP' });
                appSend({ type: 'STOP' });
              }}
            >
              stop
            </StopButton>
          )}
          {state.matches('counting') && (
            <Button type="button" onClick={() => send({ type: 'PAUSE' })}>
              pause
            </Button>
          )}
          {state.matches('paused') && (
            <Button type="button" onClick={() => send({ type: 'PLAY' })}>
              play
            </Button>
          )}
        </Box>
      </Box>
    </TimerGrid>
  );
};
