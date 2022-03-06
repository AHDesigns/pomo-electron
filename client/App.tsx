import React from 'react';
import { useInterpret } from '@xstate/react';
import { Pomodoro } from '@client/components';
import { useConfig } from '@client/hooks';
import { IPomodoroMachine, pomodoroMachine } from '@client/machines';
import { inspect } from '@xstate/inspect';

inspect({
  url: 'https://statecharts.io/inspect',
  iframe: false,
});

export function App(): JSX.Element {
  return (
    <span>
      <Pomodoro />
    </span>
  );
}
