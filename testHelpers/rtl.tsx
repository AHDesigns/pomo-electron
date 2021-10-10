import React, { FC, ReactElement } from 'react';
import { render, RenderOptions, waitForElementToBeRemoved } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { theme } from '@client/styles/theme';
import { ErrorBoundary } from '@client/components';
import { BridgeProvider, ConfigProvider, useConfig } from '@client/contexts';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';

import { IBridge } from '@shared/types';
import { createFakeLogger } from '@electron/services';

interface Overrides {
  bridge?: Partial<IBridge>;
}

const Providers: FC<Overrides> = ({ children, bridge }) => (
  <ErrorBoundary logger={createFakeLogger()}>
    <ThemeProvider theme={theme}>
      <BridgeProvider
        bridge={{
          ...createFakeBridge(),
          ...bridge,
        }}
      >
        <ConfigProvider logger={createFakeLogger()}>{children}</ConfigProvider>
      </BridgeProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

const WaitForLoading: FC = ({ children }) => {
  const { loading } = useConfig();
  if (loading) return <div data-testid="providers-loading">LOADING</div>;
  return <>{children}</>;
};

interface Options {
  renderOptions?: Omit<RenderOptions, 'queries'>;
  overrides?: Overrides;
}

export const renderWithoutWaiting = (
  ui: ReactElement,
  { renderOptions, overrides } = {} as Options
) =>
  render(ui, {
    wrapper: ({ children }) => <Providers {...overrides}>{children}</Providers>,
    ...renderOptions,
  });

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
