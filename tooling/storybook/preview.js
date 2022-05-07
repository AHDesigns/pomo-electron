/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { fakeRepositories } from '../../electron/repositories/fakes';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '../../client/hooks/providers';
import { createFakeHooks } from '../../client/machines';
import { ErrorBoundary, ScrollBar } from '../../client/components';
import { theme } from '../../client/styles/theme';
import { GlobalStyle } from '../../client/styles/GlobalStyle';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
  (Story) => (
    <Providers>
      <Story />
    </Providers>
  ),
];

function Providers({ children, hooks }) {
  return (
    <BridgeProvider bridge={fakeRepositories()}>
      <LoggerProvider>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ScrollBar />
            <MachinesProvider hooks={{ ...createFakeHooks(), ...hooks }}>
              {children}
            </MachinesProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}
