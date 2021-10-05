/**
 * @jest-environment jsdom
 */
import React from 'react';
import FakeTimers from '@sinonjs/fake-timers';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@client/App';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';

jest.mock('@electron/services/logger');

describe('given a brand new user with no existing config', () => {
  async function load(): Promise<{
    tick: (duration: number | string) => Promise<void>;
    runAllAsync: () => Promise<void>;
  }> {
    const clock = FakeTimers.createClock();

    render(<App bridge={createFakeBridge()} clock={clock} />);

    await waitFor(() => {
      expect(screen.getByText('Pomodoro App')).toBeInTheDocument();
    });

    async function tick(duration: number | string): Promise<void> {
      await act(async () => void (await clock.tickAsync(duration)));
    }

    async function runAllAsync(): Promise<void> {
      await act(async () => void (await clock.runAllAsync()));
    }

    return { tick, runAllAsync };
  }

  describe('when the app is opened', () => {
    it.skip('should show the timer with a default time of 25 mins', async () => {
      await load();
      expect(screen.getByText('Timer')).toBeInTheDocument();
      expect(screen.getByText(/25 : 00/)).toBeInTheDocument();
    });
  });

  describe('when the timer is started', () => {
    it('should display the timer in the app and menu bar, pausing and stopping when appropriate', async () => {
      const { tick, runAllAsync } = await load();

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      await tick('11');

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();

      // userEvent.click(screen.getByRole('button', { name: 'stop' }));

      // await waitForElementToBeRemoved(() => screen.getByRole('button', { name: 'stop' }));

      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');

      // -------------- pause timer ------------- //
      userEvent.click(screen.getByRole('button', { name: 'pause' }));

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();

      // await tick('5');
      // await clock.runAllAsync();
      await runAllAsync();

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();
      // // it.todo('should show the stopped time in the menu bar');

      // // -------------- press play -------------- //
      userEvent.click(screen.getByRole('button', { name: 'play' }));

      // await time({ seconds: 9 });
      //  await time({ seconds: 1 });
      await tick('09');
      // // timer ticks down
      expect(screen.getByText(/24 : 40/)).toBeInTheDocument();

      // userEvent.click(screen.getByRole('button', { name: 'stop' }));
      // await clock.tickAsync('11');
      //  await clock.runAllAsync();
      //  await waitFor(() => {
      //     expect(screen.getByText('25 : 00')).toBeInTheDocument();
      //   });

      // expect(screen.getByText('start')).toBeInTheDocument();

      // console.log('test should be finished');
    });
  });
});
