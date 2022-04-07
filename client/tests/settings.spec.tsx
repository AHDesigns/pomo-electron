import { App } from '@client/App';
import { merge } from '@shared/merge';
import { ok } from '@shared/Result';
import T from '@client/copy';
import { emptyConfig } from '@shared/types';
import { pageModel } from '@test/pageModels';
import { act, render, screen } from '@test/rtl';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { tick } from '@test/tick';

jest.mock('@xstate/inspect');

beforeEach(() => {
  jest.useFakeTimers();
});

async function initTest() {
  return render(<App />, {
    overrides: {
      bridge: {
        storeRead: async () =>
          ok(
            merge(emptyConfig, {
              timers: { pomo: 10, short: 5, long: 8 },
            })
          ),
      },
    },
  });
}

const {
  nav,
  settings,
  pomo: { timer },
} = pageModel;

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  const button = screen.queryByRole('button', { name: T.pomoTimer.stop });
  if (button) userEvent.click(button);
  act(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});

describe(`given no timer is running
when the user changes the timer duration to 7 minutes and starts the timer`, () => {
  test('the timer ticks down every second, starting at 7 minutes', async () => {
    await initTest();

    expect(timer.current({ mins: 10 })).toBeInTheDocument();
    userEvent.click(nav.toSettings());

    userEvent.type(settings.timer.pomo(), '{backspace}7');

    userEvent.click(nav.toTimer());

    expect(timer.current({ mins: 7 })).toBeInTheDocument();

    userEvent.click(timer.startButton());

    tick(60 * 7);

    expect(timer.current({ mins: 5 })).toBeInTheDocument();
  });
});

describe(`given a 5 minute timer is running
when the user changes the timer settings to 12 minutes`, () => {
  test.todo('the timer keeps ticking down for the original 5 minutes without pause');
  test.todo('once the timer completes, the timer shows the new time of 12 minutes');
});
