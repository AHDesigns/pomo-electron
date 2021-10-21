import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@client/App';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { tick } from '@test/tick';
import { createFakeLogger } from '@electron/services';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  // deliberately not wrapping this in act. If anything throws errors, make sure to clean it up in the test
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('app tests, including os level tests like the menubar', () => {
  describe('given a brand new user with no existing config, opens the app', () => {
    async function load() {
      render(<App bridge={createFakeBridge()} logger={createFakeLogger()} />);

      await waitFor(() => {
        expect(screen.getByText('Pomodoro App')).toBeInTheDocument();
      });
    }

    test('when the timer is started, it should display the timer in the app and menu bar, pausing and stopping when appropriate', async () => {
      await load();

      expect(screen.getByText('Timer')).toBeInTheDocument();
      expect(screen.getByText(/25 : 00/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      tick(11);

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();

      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');

      /* ******************************************************************* */
      /* PAUSE
      /* ******************************************************************* */

      userEvent.click(screen.getByRole('button', { name: 'pause' }));

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();

      tick(4);

      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();
      // // it.todo('should show the paused time in the menu bar');

      /* ******************************************************************* */
      /* PLAY
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: 'play' }));

      tick(9);

      expect(screen.getByText(/24 : 40/)).toBeInTheDocument();

      // it.todo('should show the time in the menu bar');

      /* ******************************************************************* */
      /* STOP
      /* ******************************************************************* */

      userEvent.click(screen.getByRole('button', { name: 'stop' }));

      expect(screen.getByText('25 : 00')).toBeInTheDocument();

      tick(9);

      expect(screen.getByText('25 : 00')).toBeInTheDocument();

      expect(screen.getByText('start')).toBeInTheDocument();

      // it.todo('should clear the time in the menu bar');
      // it.todo('should show the inactive icon in the menu bar');

      /* ******************************************************************* */
      /* RESTART
      /* ******************************************************************* */

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      tick(14);
      expect(screen.getByText(/24 : 46/)).toBeInTheDocument();

      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');
    });

    test.todo('when the user clicks "settings" they are navigated to "settings"');
  });
});
