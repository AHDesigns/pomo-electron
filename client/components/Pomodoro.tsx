import React, { FC } from 'react';
import { Timer } from '@client/components';
import { TimerHook } from '@client/contexts';

export const Pomodoro: FC<TimerHook & { clock: any }> = ({ send, state, clock }) => {
  const {
    autoStart: { beforeLongBreak, beforePomo, beforeShortBreak },
    timers: { longBreak, shortBreak, pomo },
  } = state.context;

  return (
    <>
      {state.matches('pomo') && (
        <Timer
          duration={pomo}
          appSend={send}
          title="pomodoro"
          autoStart={beforePomo}
          clock={clock}
        />
      )}
      {state.matches('shortBreak') && (
        <Timer
          duration={shortBreak}
          appSend={send}
          title="break"
          autoStart={beforeShortBreak}
          clock={clock}
        />
      )}
      {state.matches('longBreak') && (
        <Timer
          appSend={send}
          duration={longBreak}
          title="long break"
          autoStart={beforeLongBreak}
          clock={clock}
        />
      )}
    </>
  );
};
