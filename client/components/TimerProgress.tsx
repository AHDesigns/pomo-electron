import React from 'react';
import { testWrap } from './testWrap/testComp';

interface ITimerProgress {
  duration: number;
  mins: number;
  seconds: number;
  state: { matches(state: string): boolean };
  title: string;
}

export function TimerProgressC({
  duration,
  mins,
  seconds,
  state,
  title,
}: ITimerProgress): JSX.Element {
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
        className="stroke-thmBackgroundProminent"
        cx={50}
        cy={50}
        r={radius}
        fill="none"
        strokeWidth={stroke}
      />
      <circle
        className="stroke-thmBright"
        style={{
          transform: 'rotate(-90deg)',
          transformOrigin: 'center',
          transition: state.matches('initial') ? 'all 0.2s' : 'all 1s',
          transitionTimingFunction: 'linear',
        }}
        cx={50}
        cy={50}
        r={radius}
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

export const TimerProgress = testWrap(TimerProgressC, 'timer-progress');
