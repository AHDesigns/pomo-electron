import React from 'react';
import { screen, render } from '@test/rtl';
// import { screen, render, cleanup } from '@testing-library/react';
import { IPomo, Pomodoro } from '@client/components';
import { ok } from '@shared/Result';
import { emptyConfig } from '@shared/types';
import userEvent from '@testing-library/user-event';
import { tick } from '@test/tick';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  // turn off if test fails
  // const button = screen.queryByRole('button', { name: 'stop' });
  // if (button) userEvent.click(button);
  // deliberately not wrapping this in act. If anything throws errors, make sure to clean it up in the test
  // jest.runOnlyPendingTimers();
  // jest.useRealTimers();
});

describe('timer tests', () => {
  const settingsNoAutoStarts = {
    pomo: 10,
    shortBreak: 5,
    longBreak: 8,
  };

  const hooks: IPomo['hooks'] = {
    start: jest.fn(),
    tick: jest.fn(),
    pause: jest.fn(),
    play: jest.fn(),
    stop: jest.fn(),
    // complete: jest.fn(),
  };

  describe(`given a timer has not been run and has settings`, () => {
    test('the timer behaves as expected', async () => {
      await render(<Pomodoro hooks={hooks} />, {
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

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      expect(hooks.start).toHaveBeenCalledTimes(1);
      expect(hooks.start).toHaveBeenCalledWith(
        expect.objectContaining({ mins: 10, seconds: 0, timer: 'pomo' })
      );

      tick(11);

      expect(hooks.tick).toHaveBeenCalledTimes(11);
      expect(hooks.tick).toHaveBeenNthCalledWith(
        11,
        expect.objectContaining({ mins: 9, seconds: 49, timer: 'pomo' })
      );

      expect(screen.getByText(/9 : 49/)).toBeInTheDocument();

      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'pause' }));

      tick(11);

      expect(hooks.pause).toHaveBeenCalledTimes(1);
      expect(hooks.pause).toHaveBeenCalledWith(
        expect.objectContaining({ mins: 9, seconds: 49, timer: 'pomo' })
      );

      expect(screen.getByText(/9 : 49/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'play' }));

      tick(9);

      expect(hooks.play).toHaveBeenCalledTimes(1);
      expect(hooks.play).toHaveBeenCalledWith(
        expect.objectContaining({ mins: 9, seconds: 49, timer: 'pomo' })
      );
      expect(hooks.tick).toHaveBeenCalledTimes(20);

      expect(screen.getByText(/9 : 40/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'stop' }));

      tick(5);

      expect(hooks.stop).toHaveBeenCalledTimes(1);
      expect(hooks.stop).toHaveBeenCalledWith(
        expect.objectContaining({ mins: 9, seconds: 40, timer: 'pomo' })
      );

      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      tick(5);

      expect(hooks.start).toHaveBeenCalledTimes(2);
      expect(hooks.start).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ mins: 10, seconds: 0, timer: 'pomo' })
      );

      expect(screen.getByText(/9 : 55/)).toBeInTheDocument();
      expect(hooks.tick).toHaveBeenLastCalledWith(
        expect.objectContaining({ mins: 9, seconds: 55, timer: 'pomo' })
      );
    });

    test('when the timer progresses through a full long break cycle', async () => {
      await render(<Pomodoro hooks={hooks} />, {
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

      userEvent.click(screen.getByRole('button', { name: 'start' }));

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      tick(60 * 9 + 59);

      expect(screen.getByText(/0 : 01/)).toBeInTheDocument();
      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      tick(1);

      // expect(hooks.complete).toHaveBeenCalledTimes(1);
      // expect(hooks.complete).toHaveBeenCalledWith(expect.objectContaining({ timer: 'pomo' }));

      expect(screen.getByText(/5 : 00/)).toBeInTheDocument();

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      // stopping for now, as having all sorts of issues with spawning actors not stopping. https://github.com/statelyai/xstate/issues/1642 this issue makes me question the validity of working with this library. I think i will wait till v5, getting tired of working with something that breaks all the time.

      // this only exists as a problem in tests when the timer is unmounted, and I get a bunch of issues about the itnerpreter unable to read `name` of some property.

      // can be recreated in the app by simply unmounting the Pomodoro component (the pomoMachine must have a timerMachine spawned to cause this issue)
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
