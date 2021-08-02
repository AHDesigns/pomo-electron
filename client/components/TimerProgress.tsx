import { TimerState } from '@client/machines/timer/timerMachine';
import { useTheme } from 'styled-components';
import React from 'react';

interface ITimerProgress {
  duration: number;
  mins: number;
  seconds: number;
  state: TimerState;
  title: string;
}

export function TimerProgress({
  duration,
  mins,
  seconds,
  state,
  title,
}: ITimerProgress): JSX.Element {
  const theme = useTheme();
  const totalDurationInSeconds = duration * 60;

  const secondsExpired = 60 - seconds;
  const minutesExpired = duration - mins;
  const timeExpired = secondsExpired + minutesExpired;
  const stroke = 1;
  const radius = 50 - stroke;
  const circumference = radius * 2 * Math.PI;

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
          transition: state.matches('initial') ? 'all 0.2s' : 'all 1s',
          transitionTimingFunction: 'linear',
        }}
        cx={50}
        cy={50}
        r={radius}
        stroke={title === 'pomodoro' ? theme.palette.primary : theme.palette.green}
        fill="none"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={
          state.matches('initial')
            ? circumference
            : circumference * (1 - timeExpired / totalDurationInSeconds)
        }
      />
    </svg>
  );
}
