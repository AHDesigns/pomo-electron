/* eslint-disable no-console */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';
import { ErrorBoundary, ScrollBar } from '@client/components';
import {
  BridgeProvider,
  ConfigProvider,
  MachinesProvider,
  LoggerProvider,
} from '@client/hooks/providers';

import { IBridge, IClientLogger } from '@shared/types';
import { GlobalStyle } from './styles/GlobalStyle';
import { App } from './App';

interface IProviders {
  bridge: IBridge;
}

const hooks = {
  onTickHook: () => {},
  onStartHook: console.log,
  onPauseHook: console.log,
  onPlayHook: console.log,
  onStopHook: console.log,
  onCompleteHook: console.log,
};

export function Providers({ bridge }: IProviders): JSX.Element {
  return (
    <BridgeProvider bridge={bridge}>
      <LoggerProvider>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <ScrollBar />
            <ConfigProvider>
              <MachinesProvider hooks={hooks}>
                <App />
              </MachinesProvider>
            </ConfigProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}
