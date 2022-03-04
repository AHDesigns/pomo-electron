import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';
import { ErrorBoundary, ScrollBar } from '@client/components';
import { BridgeProvider, ConfigProvider } from '@client/contexts';

import { IBridge, ILogger } from '@shared/types';
import { GlobalStyle } from './styles/GlobalStyle';
import { App, IApp } from './App';

interface IProviders {
  bridge: IBridge;
  logger: ILogger;
}

const appProps: IApp = {
  hooks: {
    onStartHook: () => {},
    onTickHook: () => {},
    onPauseHook: () => {},
    onPlayHook: () => {},
    onStopHook: () => {},
    onCompleteHook: () => {},
  },
};

export function Providers({ bridge, logger }: IProviders): JSX.Element {
  return (
    <ErrorBoundary logger={logger}>
      <ThemeProvider theme={theme}>
        <BridgeProvider bridge={bridge}>
          <GlobalStyle />
          <ScrollBar />
          <ConfigProvider logger={logger}>
            <App {...appProps} />
          </ConfigProvider>
        </BridgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
