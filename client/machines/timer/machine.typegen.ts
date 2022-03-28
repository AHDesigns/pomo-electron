// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  '@@xstate/typegen': true;
  eventsCausingActions: {
    updateTimer: '_TICK';
    onTickHook: '_TICK';
    onPlayHook: 'PLAY';
    onStartHook: 'xstate.init';
    onPauseHook: 'PAUSE';
    onCompleteHook: '_TICK';
    notifyParentComplete: '_TICK';
    onStopHook: 'STOP';
    notifyParentInComplete: 'STOP';
  };
  internalEvents: {
    '': { type: '' };
    'xstate.init': { type: 'xstate.init' };
    'done.invoke.second-timer': {
      type: 'done.invoke.second-timer';
      data: unknown;
      __tip: 'See the XState TS docs to learn how to strongly type this.';
    };
    'error.platform.second-timer': { type: 'error.platform.second-timer'; data: unknown };
  };
  invokeSrcNameMap: {
    countOneSecond: 'done.invoke.second-timer';
  };
  missingImplementations: {
    actions:
      | 'onTickHook'
      | 'onPlayHook'
      | 'onStartHook'
      | 'onPauseHook'
      | 'onCompleteHook'
      | 'onStopHook';
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {
    countOneSecond: 'START' | '' | '_TICK' | 'PLAY';
  };
  eventsCausingGuards: {
    shouldAutoStart: '';
    isTimerFinished: '_TICK';
  };
  eventsCausingDelays: {};
  matchesStates: 'ready' | 'playing' | 'paused' | 'complete' | 'stopped';
  tags: never;
}
