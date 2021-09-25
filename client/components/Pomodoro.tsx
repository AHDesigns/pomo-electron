import React, { FC } from 'react';
import { Timer } from '@client/components';
import { TimerHook } from '@client/contexts';

export const Pomodoro: FC<TimerHook> = ({ send, state }) => {
  const {
    autoStart: { beforeLongBreak, beforePomo, beforeShortBreak },
    timers: { longBreak, shortBreak, pomo },
  } = state.context;

  return (
    <>
      {state.matches('pomo') && (
        <Timer duration={pomo} appSend={send} title="pomodoro" autoStart={beforePomo} />
      )}
      {state.matches('shortBreak') && (
        <Timer duration={shortBreak} appSend={send} title="break" autoStart={beforeShortBreak} />
      )}
      {state.matches('longBreak') && (
        <Timer appSend={send} duration={longBreak} title="long break" autoStart={beforeLongBreak} />
      )}
    </>
  );
};
