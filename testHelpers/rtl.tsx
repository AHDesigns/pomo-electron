import React, { ReactElement } from 'react';
import { useSelector } from '@xstate/react';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from '@client/components';
import { useConfig } from '@client/hooks';
import { createFakeHooks, IMachinesProvider, useMachines } from '@client/hooks/machines';
import { BridgeProvider, LoggerProvider, MachinesProvider } from '@client/hooks/providers';
import { theme } from '@client/styles/theme';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { IBridge } from '@shared/types';
import { render, RenderOptions, waitForElementToBeRemoved } from '@testing-library/react';

type Rendered = ReturnType<typeof render>;

interface Options {
  renderOptions?: Omit<RenderOptions, 'queries'>;
  overrides?: Overrides;
}

export function renderWithoutWaiting(ui: ReactElement, options?: Options): Rendered {
  const { overrides, renderOptions } = options ?? {};

  return render(ui, {
    wrapper: ({ children }) => <Providers {...overrides}>{children}</Providers>,
    ...renderOptions,
  });
}

async function renderAsync(ui: ReactElement, options?: Options): Promise<Rendered> {
  const { overrides, renderOptions } = options ?? {};

  const result = render(ui, {
    wrapper: ({ children }) => (
      <Providers {...overrides}>
        <WaitForLoading>{children}</WaitForLoading>
      </Providers>
    ),
    ...renderOptions,
  });

  await waitForElementToBeRemoved(() => result.getByTestId('providers-loading'));

  return result;

  function WaitForLoading({ children }: { children: React.ReactNode }): JSX.Element {
    const main = useMachines();
    const loaded = useSelector(main, (c) => c.context.loaded);
    if (!loaded) return <div data-testid="providers-loading">LOADING</div>;
    return <span>{children}</span>;
  }
}

export * from '@testing-library/react';
export { renderAsync as render, render as renderNoProviders };

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
              {children}
            </MachinesProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </LoggerProvider>
    </BridgeProvider>
  );
}
