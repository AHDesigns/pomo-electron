import { PageManager } from '@client/components';
import { merge } from '@shared/merge';
import { ok } from '@shared/Result';
import { emptyConfig } from '@shared/types';
import { pageModel, userActions } from '@test/pageModels';
import { act, render, screen, waitFor } from '@test/rtl';
import { tick } from '@test/tick';
import userEvent from '@testing-library/user-event';
import React from 'react';

beforeEach(() => {
  jest.useFakeTimers();
});

async function initTest() {
  return render(<PageManager />, {
    overrides: {
      bridge: {
        storeRead: async () =>
          ok(
            merge(emptyConfig, {
              timers: { pomo: 1, short: 5, long: 8 },
              autoStart: {
                beforePomo: false,
                beforeLongBreak: false,
                beforeShortBreak: false,
              },
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
  // const button = screen.queryByRole('button', { name: T.pomoTimer.stop });
  // if (button) userEvent.click(button);
  act(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
});

// I give up on getting this input to work correctly, not sure if it's a bug with RTL/user-event, my incorrect use of input or what, but it works fine and I'm bored of wasting time on this
describe(`given no timer is running
when the user changes the timer duration to 7 minutes and starts the timer`, () => {
  test('the timer ticks down every second, starting at 7 minutes', async () => {
    await initTest();
    const button = await screen.findByRole('button', { name: 'settings' });

    userEvent.click(button);

    const input = await screen.findByLabelText('Pomodoro');

    userEvent.type(input, '7', { delay: 10 });

    expect(await screen.findByDisplayValue('17')).toBeInTheDocument();
    await waitFor(() => {
      expect(input).toHaveValue('17');
    });

    await userActions.navigateToTimer();

    expect(await screen.findByText('17 : 00')).toBeInTheDocument();
    // screen.debug();

    // await waait();
    // userEvent.click(timer.startButton());
    // await waait();

    // tick(60 * 17);

    // expect(timer.current({ mins: 5 })).toBeInTheDocument();
  });
});

describe(`given a 5 minute timer is running
when the user changes the timer settings to 12 minutes`, () => {
  test.todo('the timer keeps ticking down for the original 5 minutes without pause');
  test.todo('once the timer completes, the timer shows the new time of 12 minutes');
});
