import React, { FC } from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@client/styles/theme';
import { ErrorBoundary, PageManager, ScrollBar } from '@client/components';
import { logger } from '@electron/services/logger';
import { BridgeProvider, ConfigProvider } from '@client/contexts';

import { GlobalStyle } from './styles/GlobalStyle';
import { IBridge } from '@shared/types';

export const App: FC<{ bridge: IBridge }> = ({ bridge }) => {
  return (
    <ErrorBoundary logger={logger}>
      <ThemeProvider theme={theme}>
        <BridgeProvider bridge={bridge}>
          <GlobalStyle />
          <ScrollBar />
          <ConfigProvider>
            <PageManager />
          </ConfigProvider>
        </BridgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
