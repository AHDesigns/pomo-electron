import React from 'react';
import { useInterpret } from '@xstate/react';
import { Pomodoro } from '@client/components';
import { useConfig } from '@client/hooks';
import { IPomodoroMachine, pomodoroMachine } from '@client/machines';

export function App(): JSX.Element {
  return <Pomodoro />;
}
