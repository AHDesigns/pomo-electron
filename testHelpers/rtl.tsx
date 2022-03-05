import React, { ReactElement } from 'react';
import { ThemeProvider } from 'styled-components';
import { ErrorBoundary } from '@client/components';
import { useConfig } from '@client/hooks';
import { createFakeHooks, IMachinesProvider } from '@client/hooks/machines';
import { BridgeProvider, ConfigProvider, MachinesProvider } from '@client/hooks/providers';
import { theme } from '@client/styles/theme';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { createFakeLogger } from '@electron/services';
import { IBridge } from '@shared/types';
import { render, RenderOptions, waitForElementToBeRemoved } from '@testing-library/react';

interface Overrides {
  bridge?: Partial<IBridge>;
  hooks?: Partial<IMachinesProvider['hooks']>;
  children?: React.ReactNode;
}

function Providers({ children, bridge, hooks }: Overrides): JSX.Element {
  const bridgeX = { ...createFakeBridge(), ...bridge };
  return (
    <ErrorBoundary logger={createFakeLogger()}>
      <ThemeProvider theme={theme}>
        <BridgeProvider bridge={bridgeX}>
          <ConfigProvider logger={createFakeLogger()}>
            <MachinesProvider hooks={{ ...createFakeHooks(), ...hooks }} bridge={bridgeX}>
              {children}
            </MachinesProvider>
          </ConfigProvider>
        </BridgeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function WaitForLoading({ children }: { children: React.ReactNode }): JSX.Element {
  const { loading } = useConfig();
  if (loading) return <div data-testid="providers-loading">LOADING</div>;
  return <span>{children}</span>;
}

interface Options {
  renderOptions?: Omit<RenderOptions, 'queries'>;
  overrides?: Overrides;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const renderWithoutWaiting = (
  ui: ReactElement,
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  { renderOptions, overrides } = {} as Options
) =>
  render(ui, {
    wrapper: ({ children }) => <Providers {...overrides}>{children}</Providers>,
    ...renderOptions,
  });

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/consistent-type-assertions
const renderAsync = async (ui: ReactElement, { renderOptions, overrides } = {} as Options) => {
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
};

export * from '@testing-library/react';
export { renderAsync as render, render as renderNoProviders };
