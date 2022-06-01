/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import { fakeRepositories } from '../../electron/repositories/fakes';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '../../client/hooks/providers';
import { createFakeHooks } from '../../client/machines';
import { ErrorBoundary, ScrollBar } from '../../client/components';
import '../../client/index.css';
import { useConfig } from '../../client/hooks';
import { themes } from '../../client/theme';

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
    <BridgeProvider bridge={fakeRepositories()}>
      <LoggerProvider>
        <MachinesProvider hooks={{ ...createFakeHooks() }}>
          <ErrorBoundary>
            <ScrollBar />
            <div className="text-thmFg">
              <Story />
              <ThemeUpdater theme={context.globals.theme} />
            </div>
          </ErrorBoundary>
        </MachinesProvider>
      </LoggerProvider>
    </BridgeProvider>
  ),
];

function ThemeUpdater({ theme }) {
  const { storeUpdate } = useConfig();
  const [lastTheme, setLastTheme] = useState(theme);
  useEffect(() => {
    if (lastTheme !== theme) {
      setLastTheme(theme);
      storeUpdate({ theme });
    }
  }, [theme, storeUpdate, lastTheme, setLastTheme]);

  return null;
}
