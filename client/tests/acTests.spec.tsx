import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '@client/App';
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { createFakeLogger } from '@electron/services';

describe('given a brand new user with no existing config', () => {
  const timerSpy = jest.fn();
  const time = timer(timerSpy);
  async function load() {
    render(<App bridge={createFakeBridge()} logger={createFakeLogger()} />);

    await waitFor(() => {
      expect(screen.getByText('Pomodoro App')).toBeInTheDocument();
    });
  }

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('when the app is opened', () => {
    it('should show the timer with a default time of 25 mins', async () => {
      await load();
      expect(screen.getByText('Timer')).toBeInTheDocument();
      expect(screen.getByText(/25 : 00/)).toBeInTheDocument();
    });
  });

  describe('when the timer is started', () => {
    it('should display the timer in the app and menu bar, pausing and stopping when appropriate', async () => {
      await load();

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      await time({ seconds: 11 });
      // timer ticks down
      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();
      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');

      // -------------- pause timer ------------- //
      userEvent.click(screen.getByRole('button', { name: 'pause' }));

      /* jest.runOnlyPendingTimers(); */
      jest.runAllTimers();
      expect(screen.getByText(/24 : 49/)).toBeInTheDocument();
      // it.todo('should show the stopped time in the menu bar');

      // -------------- press play -------------- //
      userEvent.click(screen.getByRole('button', { name: 'play' }));

      /* await time({ seconds: 9 });
       * await time({ seconds: 1 }); */
      await time({ seconds: 10 });
      // timer ticks down
      expect(screen.getByText(/24 : 40/)).toBeInTheDocument();
      // it.todo('should tick down every second in the menu bar');

      describe('when stop is pressed', () => {
        // it.todo('should stop the timer');
        // it.todo('should reset the timer');
        // it.todo('should clear the time in the menu bar');
        // it.todo('should show the inactive icon in the menu bar');

        describe('when play is pressed', () => {
          // it.todo('should tick down every second from the beginning');
          // it.todo('should show the time in the menu bar');
          // it.todo('should show the active icon in the menu bar');
        });
      });
    });
  });

  describe('when the user navigates to settings', () => {
    // it.todo('should display the settings page');

    describe('when the user changes the timer duration to 10 minutes', () => {
      // it.todo('should show 10 minutes as the new duration in the settings page');
      // it.todo('should update the users config with the new settings');

      describe('when the user navigates back to the timer', () => {
        // it.todo('should show a 10 minute timer');

        describe('when play is pressed', () => {
          // it.todo('should tick down every second, starting at 10 minutes');
          // it.todo('should show the time in the menu bar');
          // it.todo('should show the active icon in the menu bar');

          describe('when stop is pressed', () => {
            // it.todo('should stop the timer');
            // it.todo('should reset the timer to 10 mins');
            // it.todo('should clear the time in the menu bar');
            // it.todo('should show the inactive icon in the menu bar');
          });
        });
      });
    });
  });

  describe('given the user starts a 10 minute timer', () => {
    describe('when they naviagte to settings and then back to the timer', () => {
      // it.todo('should continue to tick down every second');
    });
  });

  describe('given the user starts a 10 minute timer', () => {
    describe('when the user navigates to settings and changes the timer to 20 minutes, and then navigates back to the timer', () => {
      // it.todo('should still be counting down on the orginal timer');

      describe('when stop is pressed', () => {
        // it.todo('should stop the timer');
        // it.todo('should reset the timer to 20 minutes');
      });
    });
  });
});

interface TimeObject {
  mins?: number;
  seconds?: number;
}

function timer(timerSpy: jest.Mock) {
  let ticks = 0;
  return async ({ seconds = 0 }: TimeObject) => {
    ticks += seconds;

    await waitFor(() => {
      jest.runAllTimers();
      expect(timerSpy).toHaveBeenCalledTimes(ticks);
    });
  };
}

/* async function delay(seconds = 0) {
 *   return new Promise((resolve) => {
 *     setTimeout(() => {
 *       resolve(undefined);
 *     }, seconds);
 *   });
 * } */
