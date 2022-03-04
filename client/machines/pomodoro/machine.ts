import { override } from '@shared/merge';
import { DeepPartial } from '@shared/types';
// import model, { PomodoroModel } from './model';
import {
  InterpreterFrom,
  send,
  sendParent,
  createMachine,
  forwardTo,
  assign,
  ContextFrom,
  ActorRefFrom,
} from 'xstate';
import { createModel } from 'xstate/lib/model';

const ONE_SECOND = 1000;

const timerMachine = createMachine(
  {
    id: 'timer',
    initial: 'ready',
    context: {
      minutes: 0,
      seconds: 0,
      type: 'pomo' as 'long' | 'pomo' | 'short',
    },
    states: {
      ready: {
        on: {
          START: { target: 'playing', actions: ['onStartHook'] },
        },
      },
      playing: {
        invoke: {
          id: 'second-timer',
          src: 'countOneSecond',
        },
        on: {
          _TICK: [
            { cond: 'isTimerFinished', target: 'complete' },
            { actions: ['updateTimer', 'onTickHook'], target: 'playing' },
          ],
          PAUSE: 'paused',
          STOP: 'stopped',
        },
      },
      paused: {
        entry: ['onPauseHook'],
        on: {
          PLAY: { target: 'playing', actions: ['onPlayHook'] },
          STOP: 'stopped',
        },
      },
      complete: {
        entry: ['onCompleteHook'],
        data: { complete: true },
        type: 'final',
      },
      stopped: {
        entry: ['onStopHook'],
        data: { complete: false },
        type: 'final',
      },
    },
  },
  {
    services: {
      countOneSecond: () => (sendBack) => {
        const id = setInterval(() => sendBack('_TICK'), ONE_SECOND);
        return () => clearInterval(id);
      },
    },
    guards: {
      isTimerFinished: ({ minutes, seconds }) => minutes === 0 && seconds === 1,
    },
    actions: {
      updateTimer: assign(({ minutes, seconds }) =>
        seconds === 0 ? { minutes: minutes - 1, seconds: 59 } : { minutes, seconds: seconds - 1 }
      ),
    },
  }
);

export type TimerActorRef = ActorRefFrom<typeof timerMachine>;

const model = createModel(
  {
    completed: {
      pomo: 0,
      short: 0,
      long: 0,
    },
    timers: {
      pomo: 1,
      short: 1,
      long: 1,
    },
    autoStart: {
      beforeShortBreak: true,
      beforeLongBreak: true,
      beforePomo: false,
    },
  },
  {
    events: {
      'done.invoke.timer-actor': (complete: boolean) => ({ data: { complete } }),
    },
  }
);

const pomodoroMachine = (actions: IPomodoroMachine['actions']) =>
  model.createMachine(
    {
      id: 'pomodoroMachine',
      context: model.initialContext,
      initial: 'pomo',
      states: {
        pomo: {
          invoke: {
            id: 'timer-actor',
            src: timerMachine.withConfig({ actions }),
            data: ({ timers: { pomo } }) => ({ minutes: pomo, seconds: 0, type: 'pomo' }),
            onDone: [
              { cond: 'isTimerStopped', target: 'pomo' },
              { target: 'breakDecision', actions: ['increasePomoCount'] },
            ],
          },
        },
        breakDecision: {
          always: [{ cond: 'isLongBreak', target: 'long' }, { target: 'short' }],
        },
        short: {
          invoke: {
            id: 'timer-actor',
            src: timerMachine.withConfig({ actions }),
            data: ({ timers: { short } }) => ({ minutes: short, seconds: 0, type: 'short' }),
            onDone: { target: 'pomo' },
          },
        },
        long: {
          invoke: {
            id: 'timer-actor',
            src: timerMachine.withConfig({ actions }),
            data: ({ timers: { long } }) => ({ minutes: long, seconds: 0, type: 'long' }),
            onDone: { target: 'pomo' },
          },
          exit: 'increaseBreakCount',
        },
      },
    },
    {
      guards: {
        isLongBreak: ({ completed: { pomo } }) => pomo !== 0 && pomo % 4 === 0,
        isTimerStopped: (_, e) => {
          if (e.type !== 'done.invoke.timer-actor') throw new Error('ah');
          return !e.data.complete;
        },
      },
      actions: {
        increasePomoCount: model.assign({
          completed: ({ completed }) => ({ ...completed, pomo: completed.pomo + 1 }),
        }),
        increaseBreakCount: model.assign({
          completed: ({ completed }) => ({ ...completed, long: completed.long + 1 }),
        }),
      },
    }
  );

type PomodoroMachineType = ReturnType<typeof pomodoroMachine>;
export type PomodoroMachine = InterpreterFrom<PomodoroMachineType>;

interface Hook {
  (info: { minutes: number; seconds: number; type: 'long' | 'pomo' | 'short' }): void;
}

export interface IPomodoroMachine {
  context?: DeepPartial<ContextFrom<typeof model>>;
  actions: {
    onStartHook: Hook;
    onTickHook: Hook;
    onPauseHook: Hook;
    onPlayHook: Hook;
    onStopHook: Hook;
    onCompleteHook: Hook;
  };
}

function pomodoroMachineFactory({ context, actions }: IPomodoroMachine): PomodoroMachineType {
  const actionsStuff: IPomodoroMachine['actions'] = {
    onStartHook: (active) => {
      actions.onStartHook({ ...active });
    },
    onTickHook: (active) => {
      actions.onTickHook({ ...active });
    },
    onPauseHook: (active) => {
      actions.onPauseHook({ ...active });
    },
    onPlayHook: (active) => {
      actions.onPlayHook({ ...active });
    },
    onStopHook: (active) => {
      actions.onStopHook({ ...active });
    },
    onCompleteHook: (active) => {
      actions.onCompleteHook({ ...active });
    },
  };

  return pomodoroMachine(actionsStuff).withContext(override(model.initialContext, context));
}

export default pomodoroMachineFactory;
