// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    updateTimerConfig: 'CONFIG_LOADED';
    increasePomoCount: 'TIMER_INCOMPLETE';
    increaseBreakCount: 'xstate.init';
  };
  internalEvents: {
    '': { type: '' };
    'done.invoke.pomodoroMachine.short:invocation[0]': {
      type: 'done.invoke.pomodoroMachine.short:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'done.invoke.pomodoroMachine.long:invocation[0]': {
      type: 'done.invoke.pomodoroMachine.long:invocation[0]';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'xstate.init': { type: 'xstate.init' };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    isLongBreak: '';
  };
  eventsCausingDelays: {};
  matchesStates: 'loading' | 'pomo' | 'breakDecision' | 'short' | 'long';
  tags: never;
}
