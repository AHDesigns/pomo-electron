/* eslint-disable react/jsx-filename-extension */
import React, { useEffect } from 'react';
import { fakeRepositories } from '../../electron/repositories/fakes';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '../../client/hooks/providers';
import { createFakeHooks } from '../../client/machines';
import { ErrorBoundary, ScrollBar } from '../../client/components';
import '../../client/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Pomo colour theme',
    defaultValue: 'nord',
    toolbar: {
      icon: 'paintbrush',
      items: ['nord', 'nord-light'],
    },
  },
};

export const decorators = [
  WithThemeProvider,
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
          <ScrollBar />
          <MachinesProvider hooks={{ ...createFakeHooks(), ...hooks }}>
            <div className="text-thmWhite">{children}</div>
          </MachinesProvider>
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}

function WithThemeProvider(Story, context) {
  const { theme } = context.globals;
  useEffect(() => {
    const r = document.querySelector(':root')?.style;
    if (!r) return;
    if (theme === 'nord') {
      r.setProperty('--color-background', '46 52 64');
      r.setProperty('--color-backgroundProminent', '59 66 82');
      r.setProperty('--color-backgroundBright', '67 76 94');
      r.setProperty('--color-backgroundBrightest', '76 86 106');
      r.setProperty('--color-accent', '255 255 255');
      r.setProperty('--color-white', '216 222 233');
      r.setProperty('--color-whiteBright', '229 233 240');
      r.setProperty('--color-whiteBrightest', '236 239 244');
      r.setProperty('--color-primary', '143 188 187');
      r.setProperty('--color-bright', '136 192 208');
      r.setProperty('--color-secondary', '129 161 193');
      r.setProperty('--color-tertiary', '94 129 172');
      r.setProperty('--color-red', '191 97 106');
      r.setProperty('--color-orange', '208 135 112');
      r.setProperty('--color-yellow', '235 203 139');
      r.setProperty('--color-green', '163 190 140');
      r.setProperty('--color-magenta', '180 142 173');
    } else if (theme === 'nord-light') {
      r.setProperty('--color-white', '46 52 64');
      r.setProperty('--color-whiteBright', '59 66 82');
      r.setProperty('--color-whiteBrightest', '67 76 94');
      r.setProperty('--color-backgroundBrightest', '46 52 64');

      r.setProperty('--color-background', '216 222 233');
      r.setProperty('--color-backgroundProminent', '229 233 240');
      r.setProperty('--color-backgroundBright', '46 52 64');

      r.setProperty('--color-accent', '255 255 255');

      r.setProperty('--color-primary', '143 188 187');
      r.setProperty('--color-bright', '136 192 208');
      r.setProperty('--color-secondary', '129 161 193');
      r.setProperty('--color-tertiary', '94 129 172');
      r.setProperty('--color-red', '191 97 106');
      r.setProperty('--color-orange', '208 135 112');
      r.setProperty('--color-yellow', '235 203 139');
      r.setProperty('--color-green', '163 190 140');
      r.setProperty('--color-magenta', '180 142 173');
    }
  }, [theme]);
  return <Story {...context} />;
}
