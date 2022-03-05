/* eslint-disable no-console */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';
import { ErrorBoundary, ScrollBar } from '@client/components';
import { BridgeProvider, ConfigProvider, MachinesProvider } from '@client/hooks/providers';

import { IBridge, ILogger } from '@shared/types';
import { GlobalStyle } from './styles/GlobalStyle';
import { App } from './App';

interface IProviders {
  bridge: IBridge;
  logger: ILogger;
}

const hooks = {
  onTickHook: () => {},
  onStartHook: console.log,
  onPauseHook: console.log,
  onPlayHook: console.log,
  onStopHook: console.log,
  onCompleteHook: console.log,
};

export function Providers({ bridge, logger }: IProviders): JSX.Element {
  return (
    <ErrorBoundary logger={logger}>
      <ThemeProvider theme={theme}>
        <BridgeProvider bridge={bridge}>
          <GlobalStyle />
          <ScrollBar />
          <ConfigProvider logger={logger}>
            <MachinesProvider hooks={hooks} bridge={bridge}>
              <App />
            </MachinesProvider>
          </ConfigProvider>
        </BridgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
