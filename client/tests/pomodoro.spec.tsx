import React from 'react';
import { screen, render, act } from '@test/rtl';
import { App, IApp } from '@client/App';
import T from '@client/copy';
import { ok } from '@shared/Result';
import { emptyConfig } from '@shared/types';
import userEvent from '@testing-library/user-event';
import { tick } from '@test/tick';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  // eslint-disable-next-line prefer-const
  let testFailed = false;

  // XXX: uncomment if error, for better test output
  testFailed = true;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (testFailed) {
    const button = screen.queryByRole('button', { name: T.pomoTimer.stop });
    if (button) userEvent.click(button);
    act(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
  } else {
    // deliberately not wrapping this in act. If anything throws errors, make sure to clean it up in the test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  }
});

describe('Pomodoro tests', () => {
  const settingsNoAutoStarts = {
    pomo: 10,
    short: 5,
    long: 8,
  };

  const hooks: IApp['hooks'] = {
    onStartHook: jest.fn(),
    onTickHook: jest.fn(),
    onPauseHook: jest.fn(),
    onPlayHook: jest.fn(),
    onStopHook: jest.fn(),
    onCompleteHook: jest.fn(),
  };

  describe.only(`given a timer has not been run and has settings`, () => {
    test('the timer behaves as expected', async () => {
      await render(<App hooks={hooks} />, {
        overrides: {
          bridge: {
            storeRead: async () =>
              ok({
                ...emptyConfig,
                timers: settingsNoAutoStarts,
              }),
          },
        },
      });

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* START
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));

      expect(hooks.onStartHook).toHaveBeenCalledTimes(1);
      expect(hooks.onStartHook).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 10, seconds: 0, type: 'pomo' })
      );

      tick(11);

      expect(hooks.onTickHook).toHaveBeenCalledTimes(11);
      expect(hooks.onTickHook).toHaveBeenNthCalledWith(
        11,
        expect.objectContaining({ minutes: 9, seconds: 49, type: 'pomo' })
      );

      expect(screen.getByText(/9 : 49/)).toBeInTheDocument();
      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');

      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* PAUSE
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.pause }));

      tick(11);

      expect(hooks.onPauseHook).toHaveBeenCalledTimes(1);
      expect(hooks.onPauseHook).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 9, seconds: 49, type: 'pomo' })
      );

      expect(screen.getByText(/9 : 49/)).toBeInTheDocument();
      // // it.todo('should show the paused time in the menu bar');

      /* ******************************************************************* */
      /* PLAY
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.play }));

      tick(9);

      expect(hooks.onPlayHook).toHaveBeenCalledTimes(1);
      expect(hooks.onPlayHook).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 9, seconds: 49, type: 'pomo' })
      );
      expect(hooks.onTickHook).toHaveBeenCalledTimes(20);

      expect(screen.getByText(/9 : 40/)).toBeInTheDocument();
      // it.todo('should show the time in the menu bar');

      /* ******************************************************************* */
      /* STOP
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.stop }));

      tick(5);

      expect(hooks.onStopHook).toHaveBeenCalledTimes(1);
      expect(hooks.onStopHook).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 9, seconds: 40, type: 'pomo' })
      );

      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();
      // it.todo('should clear the time in the menu bar');
      // it.todo('should show the inactive icon in the menu bar');

      /* ******************************************************************* */
      /* RESTART
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));

      tick(5);

      expect(hooks.onStartHook).toHaveBeenCalledTimes(2);
      expect(hooks.onStartHook).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ minutes: 10, seconds: 0, type: 'pomo' })
      );

      expect(screen.getByText(/9 : 55/)).toBeInTheDocument();
      expect(hooks.onTickHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ minutes: 9, seconds: 55, type: 'pomo' })
      );
      // it.todo('should show the time in the menu bar');
      // it.todo('should show the active icon in the menu bar');

      /* ******************************************************************* */
      /* STOP
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.stop }));
    });

    test('when the timer progresses through a full long break cycle', async () => {
      await render(<App hooks={hooks} />, {
        overrides: {
          bridge: {
            storeRead: async () =>
              ok({
                ...emptyConfig,
                timers: settingsNoAutoStarts,
              }),
          },
        },
      });

      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      tick(60 * 9 + 59);

      expect(screen.getByText(/0 : 01/)).toBeInTheDocument();
      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      tick(1);

      expect(hooks.onCompleteHook).toHaveBeenCalledTimes(1);
      expect(hooks.onCompleteHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'pomo' }));

      expect(screen.getByText(/5 : 00/)).toBeInTheDocument();

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();
    });

    // describe('when the pomo timer is started and finishes', () => {
    //   it.todo('should transition to the short timer but not start');
    //   it.todo('should show a single pomo timer has been completed');
    //   it.todo('should invoke the onCompleteHooks with pomo argument');
    // });
  });

  // describe('given 3/4 pomo timers have finished', () => {
  //   describe('when the 4th pomo timer finishes', () => {
  //     it.todo('should transition to the long break but not start');
  //     it.todo('should show 4 pomo timers have been completed');
  //     it.todo('should invoke the onCompleteHooks with pomo argument');
  //
  //     describe('when the long break is started', () => {
  //       it.todo('should start counting down for 8 minutes');
  //       it.todo("should show the user hasn't completed any long breaks yet");
  //       it.todo('should invoke the onStartHooks with long break argument');
  //
  //       describe('when the timer is paused', () => {
  //         it.todo('should pause the timer');
  //         it.todo('should invoke the onPauseHooks with long break argument');
  //
  //         describe('when play is pressed', () => {
  //           it.todo('should resume the countdown');
  //           it.todo('should invoke the onResumeHooks with long break argument');
  //
  //           describe('when stop is pressed', () => {
  //             it.todo('should stop the timer and transition to pomo timer');
  //             it.todo('should show the user has completed 1 long break');
  //             // TODO on stop hook for break
  //             it.todo('should invoke the onStopHooks with long break argument');
  //           });
  //         });
  //       });
  //     });
  //
  //     describe('when the long break is started and finishes', () => {
  //       it.todo('should transition to the pomo timer but not start');
  //       it.todo('should show the user has completed 1 long break');
  //       // TODO on stop hook for break
  //       it.todo('should invoke the onCompleteHooks with long break argument');
  //     });
  //   });
  // });

  // describe('# auto start tests', () => {
  //   const settingsShortAutoStart = {};
  //
  //   describe(`given a timer has not been run and has settings "${JSON.stringify(
  //     settingsShortAutoStart
  //   )}"`, () => {
  //     describe('when the pomo timer is started and finishes', () => {
  //       it.todo('should transition to the short timer and start immediately');
  //       it.todo('should show a single pomo timer has been completed');
  //       it.todo('should invoke the onCompleteHooks with pomo argument');
  //       it.todo('should invoke the onStartHooks with short break argument');
  //
  //       describe('when the short break is paused', () => {
  //         it.todo('should pause the timer');
  //         it.todo('should invoke the onPauseHooks with short break argument');
  //
  //         describe('when break is resumed', () => {
  //           it.todo('should continue the timer');
  //           it.todo('should invoke the onResumeHooks with short break argument');
  //         });
  //
  //         describe('when the break is stopped', () => {
  //           it.todo('should stop the timer and display the pomo timer');
  //           // TODO: there is no difference between onStop and onComplete for a short break,
  //           // so need something more elegant to handle this to prevent dev error
  //           it.todo('should invoke the onStopHooks with short break argument');
  //         });
  //       });
  //
  //       describe('when the short break finishes', () => {
  //         it.todo('should stop the timer and display the pomo timer');
  //         // TODO on stop hook for break
  //         it.todo('should invoke the onCompleteHooks with short break argument');
  //       });
  //     });
  //   });
  //
  //   const settingsShortAndPomoAutoStart = {};
  //
  //   describe(`given a timer has not be run and has settings "${JSON.stringify(
  //     settingsShortAndPomoAutoStart
  //   )}"`, () => {
  //     describe('when the pomo and short break timer finishes', () => {
  //       it.todo('should transition to the pomo timer and start immediately');
  //       it.todo('should invoke the onStartHooks with pomo argument');
  //     });
  //   });
  //
  //   const settingsAllAutoStarts = {};
  //
  //   describe(`given a timer has not be run and has settings "${JSON.stringify(
  //     settingsAllAutoStarts
  //   )}"`, () => {
  //     describe('when the final pomo timer before a long break finishes', () => {
  //       it.todo('should transition to the long break and start immediately');
  //       it.todo('should invoke the onStartHooks with long break argument');
  //     });
  //   });
  // });

  // settings interaction
  // describe('given the user starts a 10 minute timer', () => {
  //   describe('when they naviagte to settings and then back to the timer', () => {
  //     // it.todo('should continue to tick down every second');
  //   });
  // });

  // describe('given the user starts a 10 minute timer', () => {
  //   describe('when the user navigates to settings and changes the timer to 20 minutes, and then navigates back to the timer', () => {
  //     // it.todo('should still be counting down on the orginal timer');
  //
  //     describe('when stop is pressed', () => {
  //       // it.todo('should stop the timer');
  //       // it.todo('should reset the timer to 20 minutes');
  //     });
  //   });
  // });
});
