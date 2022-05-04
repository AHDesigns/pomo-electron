import { ActorRefFrom, assign, createMachine, InterpreterFrom, send, sendParent } from 'xstate';
import { configModel } from '../config/model';
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
            CANCEL: 'resetting',
            UPDATE: { actions: 'updateSetting' },
            SAVE: { actions: 'saveSettings', target: 'idle' },
          },
          tags: ['editing'],
        },
        resetting: {
          entry: [sendParent(configModel.events.REQUEST_CONFIG())],
          on: {
            CONFIG_LOADED: { actions: 'storeConfig', target: 'idle' },
          },
        },
      },
    },
    {
      actions: {
        storeConfig: assign((_, e) => e.data.timers),
        saveSettings: sendParent((c) => configModel.events.UPDATE({ timers: c })),
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
