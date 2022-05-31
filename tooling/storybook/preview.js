/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { fakeRepositories } from '../../electron/repositories/fakes';
import {
  BridgeProvider,
  LoggerProvider,
  MachinesProvider,
  ThemeProvider,
} from '../../client/hooks/providers';
import { themes, useTheme } from '../../client/hooks';
import { createFakeHooks } from '../../client/machines';
import { ErrorBoundary, ScrollBar } from '../../client/components';
import '../../client/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Pomo colour theme',
    defaultValue: themes[0],
    toolbar: {
      icon: 'paintbrush',
      items: themes,
    },
  },
};

export const decorators = [
  (Story, context) => (
    <ThemeProvider theme="nord">
      <Providers context={context}>
        <Story />
      </Providers>
    </ThemeProvider>
  ),
];

function Providers({ children, hooks, context }) {
  const [, setTheme] = useTheme();
  setTheme(context.globals.theme);

  return (
    <BridgeProvider bridge={fakeRepositories()}>
      <LoggerProvider>
        <ErrorBoundary>
          <ScrollBar />
          <MachinesProvider hooks={{ ...createFakeHooks(), ...hooks }}>
            <div className="text-thmWhite">{children}</div>
          </MachinesProvider>
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}
