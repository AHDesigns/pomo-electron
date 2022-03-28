import React from 'react';
import { usePomodoro, useTimer } from '@client/hooks';
import { useActor } from '@xstate/react';
import { Timer } from '@client/components';
import { StateValue } from 'xstate';

export function Pomodoro(): JSX.Element | null {
  const [state] = usePomodoro();
  const timerRef = useTimer();

  const { pomo, long } = state.context.completed;
  const value = getValue(state.value);
  const duration = state.context.timers[value];

  const title = getTitle(value);

  return timerRef ? (
    <>
      <Timer timerRef={timerRef} title={title} duration={duration} />
      <div style={{ display: 'none' }}>
        <p>completed pomos: {pomo}</p>
        <p>completed breaks: {long}</p>
      </div>
    </>
  ) : null;
}

function getTitle(state: 'long' | 'pomo' | 'short'): string {
  switch (state) {
    case 'pomo':
      return 'Pomodoro';
    case 'short':
      return 'Short Break';
    case 'long':
    default:
      return 'Long Break';
  }
}

function getValue(value: StateValue): 'long' | 'pomo' | 'short' {
  if (value === 'pomo' || value === 'short' || value === 'long') {
    return value;
  }
  throw new Error(`state.value is not expected timer state: got ${value.toString()}`);
}
