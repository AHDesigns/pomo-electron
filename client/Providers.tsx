import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';
import { ErrorBoundary, ScrollBar } from '@client/components';
import { BridgeProvider, ConfigProvider } from '@client/contexts';

import { IBridge, ILogger } from '@shared/types';
import { GlobalStyle } from './styles/GlobalStyle';
import { App } from './App';

interface IProviders {
  bridge: IBridge;
  logger: ILogger;
}

export function Providers({ bridge, logger }: IProviders): JSX.Element {
  return (
    <ErrorBoundary logger={logger}>
      <ThemeProvider theme={theme}>
        <BridgeProvider bridge={bridge}>
          <GlobalStyle />
          <ScrollBar />
          <ConfigProvider logger={logger}>
            <App />
          </ConfigProvider>
        </BridgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
