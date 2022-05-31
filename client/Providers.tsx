import React, { useEffect, useState } from 'react';
import { ErrorBoundary, ScrollBar } from '@client/components';
import {
  BridgeProvider,
  LoggerProvider,
  MachinesProvider,
  ThemeProvider,
} from '@client/hooks/providers';
import { IBridge } from '@shared/types';
import { PageManager } from '@client/pages';
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
        <ThemeProvider theme="nord">
          <ErrorBoundary>
            <ScrollBar />
            <MachinesProvider hooks={hooks}>
              <App shouldInspect={shouldInspect}>
                <PageManager />
              </App>
            </MachinesProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </LoggerProvider>
    </BridgeProvider>
  );
}
