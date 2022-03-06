import React from 'react';
import { usePomodoro, useTimer } from '@client/hooks';
import { useActor } from '@xstate/react';
import { Timer } from '@client/components';

export function Pomodoro(): JSX.Element | null {
  const pomodoro = usePomodoro();
  const timerRef = useTimer();

  const [state] = useActor(pomodoro);

  const { pomo, long } = state.context.completed;
  const duration = state.context.timers[state.value as 'long' | 'pomo' | 'short'];

  const title =
    state.value === 'pomo' ? 'Pomodoro' : state.value === 'short' ? 'Short Break' : 'Long Break';

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
