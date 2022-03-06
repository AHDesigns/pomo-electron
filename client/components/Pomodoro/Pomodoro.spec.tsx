import React from 'react';
import userEvent from '@testing-library/user-event';
import { tick } from '@test/tick';
import { screen, render, act } from '@test/rtl';
import T from '@client/copy';
import { ok } from '@shared/Result';
import { emptyConfig, TimerHooks, UserConfig } from '@shared/types';
import { override } from '@shared/merge';
import { Pomodoro } from './Pomodoro';

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

const hooks: TimerHooks = {
  onStartHook: jest.fn(),
  onTickHook: jest.fn(),
  onPauseHook: jest.fn(),
  onPlayHook: jest.fn(),
  onStopHook: jest.fn(),
  onCompleteHook: jest.fn(),
};

const defaultTestConfig: UserConfig = {
  ...emptyConfig,
  timers: { pomo: 10, short: 5, long: 8 },
  autoStart: { beforeShortBreak: false, beforePomo: false, beforeLongBreak: false },
};

describe('Pomodoro tests', () => {
  describe(`given a timer has not been run and has no autoStarts`, () => {
    async function initTest() {
      await render(<Pomodoro />, {
        overrides: {
          bridge: {
            storeRead: async () => ok(defaultTestConfig),
          },
          hooks,
        },
      });
    }

    test('the timer can be played, paused and stopped', async () => {
      await initTest();

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

      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();
    });

    test('the timer transitions to a short break, after a completed pomo', async () => {
      await initTest();

      /* ******************************************************************* */
      /* START
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      tick(60 * 9 + 59);

      expect(screen.getByText(/0 : 01/)).toBeInTheDocument();
      expect(screen.getByText(/completed pomos: 0/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* COMPLETE
      /* ******************************************************************* */
      tick(1);

      expect(hooks.onCompleteHook).toHaveBeenCalledTimes(1);
      expect(hooks.onCompleteHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'pomo' }));

      expect(screen.getByText(/5 : 00/)).toBeInTheDocument();

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();
    });

    test.only('a long break is scheduled every 4 breaks', async () => {
      await initTest();

      /* ******************************************************************* */
      /* Run one timer
      /* ******************************************************************* */
      runOnePomoTimer();

      expect(screen.getByText(/5 : 00/)).toBeInTheDocument();
      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      expect(hooks.onCompleteHook).toHaveBeenCalledTimes(1);

      /* ******************************************************************* */
      /* Run a short break
      /* ******************************************************************* */
      runOneShortTimer();
      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();
      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      expect(hooks.onStartHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'short' }));
      expect(hooks.onTickHook).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'short', minutes: 4, seconds: 59 })
      );
      expect(hooks.onCompleteHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'short' }));

      /* ******************************************************************* */
      /* Run pomos
      /* ******************************************************************* */
      runOnePomoAndShortBreak();
      expect(screen.getByText(/completed pomos: 2/)).toBeInTheDocument();

      runOnePomoAndShortBreak();
      expect(screen.getByText(/completed pomos: 3/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* Run pomo 4 and start long break
      /* ******************************************************************* */

      runOnePomoTimer();
      expect(screen.getByText(/completed pomos: 4/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));
      tick(1);
      expect(hooks.onStartHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'long' }));
      expect(hooks.onTickHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'long', minutes: 7, seconds: 59 })
      );

      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      tick(7 * 60 + 59);

      expect(hooks.onCompleteHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'long' }));
      expect(screen.getByText(/completed pomos: 4/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 1/)).toBeInTheDocument();

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* Run till second long break
      /* ******************************************************************* */
      runOnePomoAndShortBreak();
      expect(screen.getByText(/completed pomos: 5/)).toBeInTheDocument();

      runOnePomoAndShortBreak();
      expect(screen.getByText(/completed pomos: 6/)).toBeInTheDocument();

      runOnePomoAndShortBreak();
      expect(screen.getByText(/completed pomos: 7/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 1/)).toBeInTheDocument();

      runOnePomoAndLongBreak();
      expect(screen.getByText(/completed pomos: 8/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 2/)).toBeInTheDocument();
    });

    test('stopping a short break takes you back to a pomo timer', async () => {
      await initTest();

      /* ******************************************************************* */
      /* START BREAK
      /* ******************************************************************* */
      runOnePomoTimer();

      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));

      tick(23);

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* STOP
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.stop }));

      expect(hooks.onStopHook).toHaveBeenCalledTimes(1);
      expect(hooks.onStopHook).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 4, seconds: 37, type: 'short' })
      );

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* START POMO
      /* ******************************************************************* */
      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'pomo' }));
    });

    test('stopping a long break takes you back to a pomo timer, but still increases completed break count', async () => {
      await initTest();

      runOnePomoAndShortBreak();
      runOnePomoAndShortBreak();
      runOnePomoAndShortBreak();
      runOnePomoTimer();

      expect(screen.getByText(/completed pomos: 4/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 0/)).toBeInTheDocument();

      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));

      expect(hooks.onStartHook).toHaveBeenCalledWith(expect.objectContaining({ type: 'long' }));

      tick(23);

      /* ******************************************************************* */
      /* STOP
      /* ******************************************************************* */
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.stop }));

      expect(hooks.onStopHook).toHaveBeenCalledTimes(1);
      expect(hooks.onStopHook).toHaveBeenCalledWith(
        expect.objectContaining({ minutes: 7, seconds: 37, type: 'long' })
      );

      expect(screen.getByText(/completed pomos: 4/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 1/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* Continue to next long break
      /* ******************************************************************* */
      runOnePomoAndShortBreak();
      runOnePomoAndShortBreak();
      runOnePomoAndShortBreak();

      expect(screen.getByText(/completed pomos: 7/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 1/)).toBeInTheDocument();

      runOnePomoAndLongBreak();

      expect(screen.getByText(/completed pomos: 8/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 2/)).toBeInTheDocument();
    });
  });

  describe(`given a timer is set to autoStart short breaks`, () => {
    async function initTest() {
      await render(<Pomodoro />, {
        overrides: {
          bridge: {
            storeRead: async () =>
              ok(override(defaultTestConfig, { autoStart: { beforeShortBreak: true } })),
          },
          hooks,
        },
      });
    }

    test('should transition to the short timer and start immediately', async () => {
      await initTest();
      runOnePomoTimer();

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* Check break has started
      /* ******************************************************************* */
      expect(screen.queryByRole('button', { name: T.pomoTimer.start })).not.toBeInTheDocument();
      expect(screen.getByText(/5 : 00/)).toBeInTheDocument();
      expect(hooks.onStartHook).toHaveBeenCalledTimes(2);
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'short' })
      );

      tick(3);

      /* ******************************************************************* */
      /* Break progresses as normal
      /* ******************************************************************* */
      expect(screen.getByText(/4 : 57/)).toBeInTheDocument();
      expect(hooks.onTickHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'short', minutes: 4, seconds: 57 })
      );

      /* ******************************************************************* */
      /* After running, the pomo timer should be ready to start, but does not start
      /* ******************************************************************* */
      tick(4 * 60 + 57);

      expect(hooks.onCompleteHook).toHaveBeenCalledTimes(2);
      expect(hooks.onCompleteHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'short' })
      );

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      tick(100);

      expect(screen.getByText(/10 : 00/)).toBeInTheDocument();

      /* ******************************************************************* */
      /* Pomo timer runs as normal
      /* ******************************************************************* */
      runOnePomoTimer();
      expect(hooks.onCompleteHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'pomo' })
      );
    });
  });

  describe(`given a timer is set to autoStart pomos`, () => {
    async function initTest() {
      await render(<Pomodoro />, {
        overrides: {
          bridge: {
            storeRead: async () =>
              ok(override(defaultTestConfig, { autoStart: { beforePomo: true } })),
          },
          hooks,
        },
      });
    }

    it('should start immediately', async () => {
      await initTest();

      tick(3);
      expect(screen.queryByRole('button', { name: T.pomoTimer.start })).not.toBeInTheDocument();
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'pomo' }));
      expect(screen.getByText(/9 : 57/)).toBeInTheDocument();
      expect(hooks.onTickHook).toHaveBeenCalledTimes(3);
    });
  });

  describe(`given a timer is set to autoStart longBreaks`, () => {
    async function initTest() {
      await render(<Pomodoro />, {
        overrides: {
          bridge: {
            storeRead: async () =>
              ok(override(defaultTestConfig, { autoStart: { beforeLongBreak: true } })),
          },
          hooks,
        },
      });
    }

    it('should start long break immediately', async () => {
      await initTest();
      runOnePomoAndShortBreak();
      runOnePomoAndShortBreak();
      runOnePomoAndShortBreak();
      runOnePomoTimer();

      expect(screen.queryByRole('button', { name: T.pomoTimer.start })).not.toBeInTheDocument();
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'long' }));

      tick(3);

      expect(screen.getByText(/7 : 57/)).toBeInTheDocument();
    });
  });

  describe(`given a timer is set to autoStart everything`, () => {
    async function initTest() {
      await render(<Pomodoro />, {
        overrides: {
          bridge: {
            storeRead: async () =>
              ok(
                override(defaultTestConfig, {
                  autoStart: { beforeLongBreak: true, beforeShortBreak: true, beforePomo: true },
                })
              ),
          },
          hooks,
        },
      });
    }

    it('should start all timers immediately', async () => {
      await initTest();

      expect(screen.queryByRole('button', { name: T.pomoTimer.start })).not.toBeInTheDocument();
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'pomo' }));

      tick(10 * 60);

      expect(screen.getByText(/completed pomos: 1/)).toBeInTheDocument();
      expect(hooks.onCompleteHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'pomo' })
      );
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'short' })
      );

      tick(5 * 60);

      expect(hooks.onCompleteHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'short' })
      );
      expect(hooks.onStartHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'pomo' }));

      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.pause }));
      expect(hooks.onPauseHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'pomo' }));
      userEvent.click(screen.getByRole('button', { name: T.pomoTimer.play }));
      expect(hooks.onPlayHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'pomo' }));

      tick(10 * 60); // pomo 2
      expect(screen.getByText(/completed pomos: 2/)).toBeInTheDocument();

      tick(5 * 60); // break 2
      tick(10 * 60); // pomo 3
      expect(screen.getByText(/completed pomos: 3/)).toBeInTheDocument();

      tick(5 * 60); // break 3
      tick(10 * 60); // pomo 4
      expect(screen.getByText(/completed pomos: 4/)).toBeInTheDocument();

      expect(hooks.onStartHook).toHaveBeenLastCalledWith(expect.objectContaining({ type: 'long' }));
      tick(8 * 60); // longBreak

      expect(screen.getByText(/completed pomos: 4/)).toBeInTheDocument();
      expect(screen.getByText(/completed breaks: 1/)).toBeInTheDocument();
      expect(hooks.onCompleteHook).toHaveBeenLastCalledWith(
        expect.objectContaining({ type: 'long' })
      );
    });
  });
});

/* ******************************************************************* */
/* HELPERS
/* ******************************************************************* */

function runOnePomoTimer() {
  expect(screen.getByText(/10 : 00/)).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));
  tick(60 * 10);
}

function runOneShortTimer() {
  expect(screen.getByText(/5 : 00/)).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));
  tick(60 * 5);
}

function runOneLongTimer() {
  expect(screen.getByText(/8 : 00/)).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: T.pomoTimer.start }));
  tick(60 * 8);
}

function runOnePomoAndShortBreak() {
  runOnePomoTimer();

  runOneShortTimer();
  expect(screen.getByText(/10 : 00/)).toBeInTheDocument();
}

function runOnePomoAndLongBreak() {
  runOnePomoTimer();

  runOneLongTimer();
  expect(screen.getByText(/10 : 00/)).toBeInTheDocument();
}
