import React, { FC } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';
import { ErrorBoundary, PageManager, ScrollBar } from '@client/components';
import { BridgeProvider, ConfigProvider } from '@client/contexts';

import { IBridge, ILogger } from '@shared/types';
import { GlobalStyle } from './styles/GlobalStyle';

export const App: FC<{ bridge: IBridge; logger: ILogger }> = ({ bridge, logger }) => (
    <ErrorBoundary logger={logger}>
      <ThemeProvider theme={theme}>
        <BridgeProvider bridge={bridge}>
          <GlobalStyle />
          <ScrollBar />
          <ConfigProvider logger={logger}>
            <PageManager />
          </ConfigProvider>
        </BridgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
