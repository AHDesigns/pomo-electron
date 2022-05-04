import { ActorRefFrom, assign, createMachine, InterpreterFrom } from 'xstate';
import { TimerSettingsContext, TimerSettingsEvents } from './model';

export interface ITimerSettings {
  context: TimerSettingsContext;
}

export function timerSettingsFactory({ context }: ITimerSettings) {
  return createMachine(
    {
      id: 'timerSettingsMachine',
      context,
      schema: {
        context: {} as TimerSettingsContext,
        events: {} as TimerSettingsEvents,
      },
      tsTypes: {} as import('./machine.typegen').Typegen0,
      initial: 'idle',
      states: {
        idle: {
          on: {
            UPDATE: { actions: 'updateSetting', target: 'editing' },
          },
          tags: ['idle'],
        },
        editing: {
          on: {
            CANCEL: { actions: 'reset', target: 'idle' },
            UPDATE: { actions: 'updateSetting' },
          },
          tags: ['editing'],
        },
      },
    },
    {
      actions: {
        updateSetting: assign((c, e) => ({
          ...c,
          [e.data.key]: e.data.value,
        })),
      },
    }
  );
}

type TimerSettingsMachine = ReturnType<typeof timerSettingsFactory>;

export type TimerSettingsService = InterpreterFrom<TimerSettingsMachine>;

export type TimerSettingsActorRef = ActorRefFrom<TimerSettingsMachine>;
