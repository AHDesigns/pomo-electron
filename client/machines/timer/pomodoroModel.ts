import { createModel } from 'xstate/lib/model';
import { none, Option } from '@shared/Option';
import { TimerActor } from '@client/machines/timer/timerMachine';
import { emptyConfig } from '@shared/types';
import { TimerType } from '@client/machines/timer/timerModel';

export interface HookInfo {
  mins: number;
  seconds: number;
  timer: TimerType;
}

export const pomodoroModel = createModel(
  {
    // pomodoro: none<TimerActor>() as Option<TimerActor>,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    pomodoro: null as TimerActor | null,
    completed: {
      pomos: 0,
      long: 0,
    },
    breakNumber: 4,
    ...emptyConfig,
  },
  {
    events: {
      start: (timeLeft: HookInfo) => timeLeft,
      tick: (timeLeft: HookInfo) => timeLeft,
      pause: (timeLeft: HookInfo) => timeLeft,
      play: (timeLeft: HookInfo) => timeLeft,
      stop: (timeLeft: HookInfo) => timeLeft,
      complete: (timeLeft: HookInfo) => timeLeft,
    },
    actions: {
      // not sure if correct, but using empty model actions to get type hints in machine
      increasePomoCount: () => ({}),
      increaseLongBreakCount: () => ({}),
      onStartHooks: () => ({}),
      onTickHooks: () => ({}),
      onPauseHooks: () => ({}),
      onPlayHooks: () => ({}),
      onStopHooks: () => ({}),
      onCompleteHooks: () => ({}),
    },
  }
);
