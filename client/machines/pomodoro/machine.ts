import { override } from '@shared/merge';
import { DeepPartial, TimerHooks } from '@shared/types';
import { ActorRefFrom, ContextFrom, InterpreterFrom } from 'xstate';
import timerMachine from '../timer/machine';
import { TimerContext } from '../timer/model';
import { assertEventType } from '../utils';
import model from './model';

function pomodoroMachine({ actions, context }: IPomodoroMachine) {
  const mappedActions: TimerHooks = {
    onStartHook(c) {
      actions.onStartHook(c);
    },
    onTickHook(c) {
      actions.onTickHook(c);
    },
    onPauseHook(c) {
      actions.onPauseHook(c);
    },
    onPlayHook(c) {
      actions.onPlayHook(c);
    },
    onStopHook(c) {
      actions.onStopHook(c);
    },
    onCompleteHook(c) {
      actions.onCompleteHook(c);
    },
  };

  const initialContext = override(model.initialContext, context);

  return model.createMachine(
    {
      id: 'pomodoroMachine',
      context: initialContext,
      initial: 'loading',
      states: {
        loading: {
          on: {
            CONFIG_LOADED: {
              actions: 'updateTimerConfig',
              target: 'pomo',
            },
          },
        },
        pomo: {
          invoke: {
            id: 'timer-actor',
            src: timerMachine.withConfig({ actions: { ...mappedActions } }),
            data: ({ timers: { pomo }, autoStart: { beforePomo } }) =>
              ({ minutes: pomo, seconds: 0, type: 'pomo', autoStart: beforePomo } as TimerContext),
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
            src: timerMachine.withConfig({ actions: { ...mappedActions } }),
            data: ({ timers: { short }, autoStart: { beforeShortBreak } }) =>
              ({
                minutes: short,
                seconds: 0,
                type: 'short',
                autoStart: beforeShortBreak,
              } as TimerContext),
            onDone: { target: 'pomo' },
          },
        },
        long: {
          invoke: {
            id: 'timer-actor',
            src: timerMachine.withConfig({ actions: { ...mappedActions } }),
            data: ({ timers: { long }, autoStart: { beforeLongBreak } }) =>
              ({
                minutes: long,
                seconds: 0,
                type: 'long',
                autoStart: beforeLongBreak,
              } as TimerContext),
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
          assertEventType(e, 'done.invoke.timer-actor');

          return !e.data.complete;
        },
      },
      actions: {
        updateTimerConfig: model.assign((ctx, e) => {
          assertEventType(e, 'CONFIG_LOADED');

          const { timers, autoStart } = e.data;

          return { ...ctx, timers, autoStart };
        }),
        increasePomoCount: model.assign({
          completed: ({ completed }) => ({ ...completed, pomo: completed.pomo + 1 }),
        }),
        increaseBreakCount: model.assign({
          completed: ({ completed }) => ({ ...completed, long: completed.long + 1 }),
        }),
      },
    }
  );
}

type PomodoroMachine = ReturnType<typeof pomodoroMachine>;

export type PomodoroService = InterpreterFrom<PomodoroMachine>;

export type PomodoroActorRef = ActorRefFrom<PomodoroMachine>;

export interface IPomodoroMachine {
  context?: DeepPartial<ContextFrom<typeof model>>;
  actions: TimerHooks;
}

export default pomodoroMachine;
