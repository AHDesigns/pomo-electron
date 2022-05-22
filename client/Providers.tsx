import React, { useEffect, useState } from 'react';
// import { ThemeProvider } from 'styled-components';
// import { theme } from '@client/styles/theme';
import { ErrorBoundary, ScrollBar, PageManager } from '@client/components';
import { BridgeProvider, MachinesProvider, LoggerProvider } from '@client/hooks/providers';
import { IBridge } from '@shared/types';
// import { GlobalStyle } from './styles/GlobalStyle';
import { App } from './App';
import { hooks } from './integrations';

interface IProviders {
  bridge: IBridge;
}

export function Providers({ bridge }: IProviders): JSX.Element {
  const [booting, setBooting] = useState(true);
  const [shouldInspect, setShouldInspect] = useState(false);

  useEffect(() => {
    bridge.isDev().then((isDev) => {
      isDev.map((b) => setShouldInspect(b));
      setBooting(false);
    });
  });

  return booting ? (
    <p>booting...</p>
  ) : (
    <BridgeProvider bridge={bridge}>
      <LoggerProvider>
        <ErrorBoundary>
          {/* <ThemeProvider theme={theme}> */}
          {/*   <GlobalStyle /> */}
          <ScrollBar />
          <MachinesProvider hooks={hooks}>
            <App shouldInspect={shouldInspect}>
              <PageManager />
            </App>
          </MachinesProvider>
          {/* </ThemeProvider> */}
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}
