import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@client/App';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { tick } from '@test/tick';

jest.mock('@electron/services/logger');

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  // deliberatly not wrapping this in act. If anything throws errors, make sure to clean it up in the test
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('given a brand new user with no existing config', () => {
  async function load() {
    /* const clock = FakeTimers.createClock(); */

    render(<App bridge={createFakeBridge()} clock={{}} />);

    await waitFor(() => {
      expect(screen.getByText('Pomodoro App')).toBeInTheDocument();
    });
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
      await load();

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      tick(11);

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();

      // userEvent.click(screen.getByRole('button', { name: 'stop' }));

      // await waitForElementToBeRemoved(() => screen.getByRole('button', { name: 'stop' }));

      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');

      // -------------- pause timer ------------- //
      userEvent.click(screen.getByRole('button', { name: 'pause' }));

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();

      tick(4);

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();
      // // it.todo('should show the stopped time in the menu bar');

      // // -------------- press play -------------- //
      userEvent.click(screen.getByRole('button', { name: 'play' }));

      tick(9);
      // // timer ticks down
      expect(screen.getByText(/24 : 40/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'stop' }));

      expect(screen.getByText('25 : 00')).toBeInTheDocument();

      expect(screen.getByText('start')).toBeInTheDocument();
    });
  });
});
