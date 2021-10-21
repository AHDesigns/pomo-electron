import { createModel } from 'xstate/lib/model';
import { none, Option } from '@shared/Option';
import { TimeLeft, TimerActor } from '@client/machines/timer/timerMachine';
import { emptyConfig } from '@shared/types';

export const pomodoroModel = createModel(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    pomodoro: none<TimerActor>() as Option<TimerActor>,
    completed: {
      pomos: 0,
      long: 0,
    },
    breakNumber: 4,
    ...emptyConfig,
  },
  {
    events: {
      start: (timeLeft: TimeLeft) => timeLeft,
      tick: (timeLeft: TimeLeft) => timeLeft,
      pause: () => ({}),
      play: (timeLeft: TimeLeft) => timeLeft,
      stop: () => ({}),
      complete: () => ({}),
    },
    actions: {
      // not sure if correct, but using empty model actions to get type hints in machine
      increasePomoCount: () => ({}),
      increaseLongBreakCount: () => ({}),
      createPomoTimer: () => ({}),
      onStartHooks: (timer: TimerType) => ({ timer }),
      onTickHooks: (timer: TimerType) => ({ timer }),
      onPauseHooks: (timer: TimerType) => ({ timer }),
      onPlayHooks: (timer: TimerType) => ({ timer }),
      onStopHooks: (timer: TimerType) => ({ timer }),
      onCompleteHooks: (timer: TimerType) => ({ timer }),
    },
  }
);

export type TimerType = 'longBreak' | 'pomo' | 'shortBreak';
