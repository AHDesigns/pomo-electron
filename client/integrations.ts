import { SlackAuth } from '@electron/repositories/slack/slack';
import { TimerHooks, UserConfig } from '@shared/types';

/* eslint-disable no-console */
export const hooks: TimerHooks = {
  onTickHook: ({ bridge, config, timer: { minutes, seconds } }) => {
    bridge.setTrayTitle(`${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`);

    const slackAuth = getSlackAuth(config);

    if (seconds === 0 && minutes > 0) {
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + minutes);

      if (slackAuth) {
        bridge.slackSetProfile(slackAuth, {
          text: minutes === 1 ? `free in 1 min` : `free in ${minutes} minutes`,
          emoji: ':tomato:',
          expiration,
        });
      }
    }
  },
  onStartHook: ({ bridge, config }) => {
    bridge.info('start hooks called');

    const duration = config.timers.pomo;

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + duration);

    bridge.setTrayIcon('active');

    const slackAuth = getSlackAuth(config);

    if (slackAuth) {
      bridge.slackSetPresence(slackAuth, 'away');
      bridge.slackSetSnooze(slackAuth, duration);
      bridge.slackSetProfile(slackAuth, {
        text: `free in ${config.timers.pomo} mins`,
        emoji: ':tomato:',
        expiration,
      });
    }
  },
  onPauseHook: console.log,
  onPlayHook: console.log,
  onStopHook: ({ bridge, config }) => {
    const slackAuth = getSlackAuth(config);
    bridge.info('end hooks called');
    bridge.setTrayTitle('');
    bridge.setTrayIcon('inactive');

    if (slackAuth) {
      bridge.slackSetPresence(slackAuth, 'active');
      bridge.slackSetSnooze(slackAuth, 0);
      bridge.slackSetProfile(slackAuth, {
        text: '',
        emoji: '',
      });
    }
  },
  onCompleteHook: ({ bridge, config }) => {
    const slackAuth = getSlackAuth(config);
    bridge.info('end hooks called');
    bridge.windowFocus();
    bridge.setTrayTitle('');
    bridge.setTrayIcon('inactive');

    if (slackAuth) {
      bridge.slackSetPresence(slackAuth, 'active');
      bridge.slackSetSnooze(slackAuth, 0);
      bridge.slackSetProfile(slackAuth, {
        text: '',
        emoji: '',
      });
    }
  },
};

function getSlackAuth(config: UserConfig): SlackAuth | null {
  return config.slack.enabled
    ? {
        token: config.slack.slackToken,
        dCookie: config.slack.slackDCookie,
        dSCookie: config.slack.slackDSCookie,
      }
    : null;
}
