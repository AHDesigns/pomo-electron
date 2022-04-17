import React, { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from '@client/components';
import { IMachinesProvider } from '@client/hooks/machines';
import { createFakeHooks } from '@client/machines';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '@client/hooks/providers';
import { theme } from '@client/styles/theme';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { IBridge } from '@shared/types';
import { render, RenderOptions, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { App } from '@client/App';

jest.mock('@xstate/inspect');

interface Options {
  renderOptions?: Omit<RenderOptions, 'queries'>;
  overrides?: Overrides;
}

async function renderAsync(ui: ReactElement, options?: Options): Promise<Rendered> {
  const { overrides, renderOptions } = options ?? {};

  const view = render(ui, {
    wrapper: ({ children }) => <Providers {...overrides}>{children}</Providers>,
    ...renderOptions,
  });

  await waitForElementToBeRemoved(() => screen.queryByTestId('providers-loading'));

  return view;
}

export * from '@testing-library/react';
export { renderAsync as render, render as renderNoProviders };

//-----------------------------------------------------------------------------
// PRIVATES
//-----------------------------------------------------------------------------

type Rendered = ReturnType<typeof render>;

interface Overrides {
  bridge?: Partial<IBridge>;
  hooks?: Partial<IMachinesProvider['hooks']>;
  children?: React.ReactNode;
}

export function Providers({ children, bridge, hooks }: Overrides): JSX.Element {
  return (
    <BridgeProvider bridge={{ ...createFakeBridge(), ...bridge }}>
      <LoggerProvider>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <MachinesProvider hooks={{ ...createFakeHooks(), ...hooks }}>
              <App shouldInspect={false}>{children}</App>
            </MachinesProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}
