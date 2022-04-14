import { merge } from '@shared/merge';
import { DeepPartial, TimerHooks } from '@shared/types';
import {
  ActorRefFrom,
  assign,
  ContextFrom,
  createMachine,
  InterpreterFrom,
  send,
  sendParent,
} from 'xstate';
import { actorIds } from '../constants';
import timerMachine from '../timer/machine';
import timerModel, { TimerContext } from '../timer/model';
import mainModel from '../main/model';
import model, { PomodoroEvents, PomodoroModel } from './model';

function pomodoroMachine({ context }: IPomodoroMachine) {
  return createMachine(
    {
      id: 'pomodoroMachine',
      tsTypes: {} as import('./machine.typegen').Typegen0,
      schema: {
        context: {} as PomodoroModel,
        events: {} as PomodoroEvents,
      },
      context: merge(model.initialContext, context),
      initial: 'loading',
      on: {
        TIMER_PAUSE: { actions: 'onPauseHook' },
        TIMER_PLAY: { actions: 'onPlayHook' },
        TIMER_START: { actions: 'onStartHook' },
        TIMER_STOP: { actions: 'onStopHook' },
        TIMER_TICK: { actions: 'onTickHook' },
      },
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
            id: actorIds.TIMER,
            src: timerMachine,
            data: ({ timers: { pomo }, autoStart: { beforePomo } }) =>
              ({ minutes: pomo, seconds: 0, type: 'pomo', autoStart: beforePomo } as TimerContext),
          },
          on: {
            TIMER_INCOMPLETE: 'pomo',
            TIMER_COMPLETE: { target: 'breakDecision', actions: ['increasePomoCount'] },
            CONFIG_LOADED: { actions: ['updateTimerConfig', 'updatePomoTimerConfig'] },
          },
        },
        breakDecision: {
          always: [{ cond: 'isLongBreak', target: 'long' }, { target: 'short' }],
        },
        short: {
          invoke: {
            id: actorIds.TIMER,
            src: timerMachine,
            data: ({ timers: { short }, autoStart: { beforeShortBreak } }) =>
              ({
                minutes: short,
                seconds: 0,
                type: 'short',
                autoStart: beforeShortBreak,
              } as TimerContext),
            onDone: { target: 'pomo' },
          },
          on: {
            TIMER_COMPLETE: 'pomo',
            TIMER_INCOMPLETE: 'pomo',
            CONFIG_LOADED: { actions: 'updateTimerConfig' },
          },
        },
        long: {
          invoke: {
            id: actorIds.TIMER,
            src: timerMachine,
            data: ({ timers: { long }, autoStart: { beforeLongBreak } }) =>
              ({
                minutes: long,
                seconds: 0,
                type: 'long',
                autoStart: beforeLongBreak,
              } as TimerContext),
            onDone: { target: 'pomo' },
          },
          on: {
            TIMER_COMPLETE: 'pomo',
            TIMER_INCOMPLETE: 'pomo',
            CONFIG_LOADED: { actions: 'updateTimerConfig' },
          },
          exit: 'increaseBreakCount',
        },
      },
    },
    {
      guards: {
        isLongBreak: ({ completed: { pomo } }) => pomo !== 0 && pomo % 4 === 0,
      },

      actions: {
        updateTimerConfig: assign((ctx, { data: { timers, autoStart } }) => ({
          ...ctx,
          timers,
          autoStart,
        })),

        increasePomoCount: assign({
          completed: ({ completed }) => ({ ...completed, pomo: completed.pomo + 1 }),
        }),

        increaseBreakCount: assign({
          completed: ({ completed }) => ({ ...completed, long: completed.long + 1 }),
        }),

        updatePomoTimerConfig: send(
          (_, { data: { timers } }) => timerModel.events.UPDATE(timers.pomo),
          { to: actorIds.TIMER }
        ),

        onPauseHook: sendParent((_, { data }) => mainModel.events.TIMER_PAUSE(data)),
        onStartHook: sendParent((_, { data }) => mainModel.events.TIMER_START(data)),
        onPlayHook: sendParent((_, { data }) => mainModel.events.TIMER_PLAY(data)),
        onStopHook: sendParent((_, { data }) => mainModel.events.TIMER_STOP(data)),
        onTickHook: sendParent((_, { data }) => mainModel.events.TIMER_TICK(data)),
      },
    }
  );
}

type PomodoroMachine = ReturnType<typeof pomodoroMachine>;

export type PomodoroService = InterpreterFrom<PomodoroMachine>;

export type PomodoroActorRef = ActorRefFrom<PomodoroMachine>;

export interface IPomodoroMachine {
  context?: DeepPartial<ContextFrom<typeof model>>;
}

export default pomodoroMachine;
