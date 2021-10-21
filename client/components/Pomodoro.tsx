import React, { FC, useEffect, useRef, useState } from 'react';
import { useActor, useMachine } from '@xstate/react';
import pomodoroMachine from '@client/machines/timer/pomodoroMachine';
import { TimeLeft, TimerActor } from '@client/machines/timer/timerMachine';
import { timerModel } from '@client/machines/timer/timerModel';
import { useConfig } from '@client/contexts';
import { pomodoroModel, TimerType } from '@client/machines/timer/pomodoroModel';
import { assertEventType } from '@client/machines/utils';

interface HookInfo extends TimeLeft {
  timer: TimerType;
}

export interface IPomo {
  hooks: {
    start: (info: HookInfo) => void;
    tick: (info: HookInfo) => void;
  };
}

export const Pomodoro: FC<IPomo> = ({ hooks }) => {
  const { config } = useConfig();

  const [state] = useMachine(pomodoroMachine, {
    context: {
      ...pomodoroModel.initialContext,
      timers: config.timers,
    },
    actions: {
      onStartHooks: (_c, event, { action: { timer } }) => {
        assertEventType(event, 'start');
        hooks.start({ ...event, timer });
      },
      onTickHooks: (_c, event) => {
        assertEventType(event, 'tick');
        hooks.tick(event);
      },
    },
  });

  const timer = state.context.pomodoro.match({
    None: () => null,
    Some: (actor) => actor,
  });

  return (
    <>
      {state.value}
      <p>completed pomos: {state.context.completed.pomos}</p>
      <p>completed breaks: {state.context.completed.long}</p>
      <p>timer</p>
      {timer && <Timer timer={timer} />}
    </>
  );
};

const Timer: FC<{ timer: TimerActor }> = ({ timer }) => {
  const [state, send] = useActor(timer);

  const { mins, seconds } = state.context.timeLeft;

  return (
    <div>
      <p>{state.value}</p>
      <p>
        {mins} : {seconds >= 10 ? seconds : `0${seconds}`}
      </p>
      <button type="button" onClick={() => send(timerModel.events.play())}>
        start
      </button>
      <button type="button" onClick={() => send(timerModel.events.pause())}>
        pause
      </button>
      <button type="button" onClick={() => send(timerModel.events.stop())}>
        stop
      </button>
      <button type="button" onClick={() => send(timerModel.events.complete())}>
        complete
      </button>
    </div>
  );
};
