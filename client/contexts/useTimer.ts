import { SlackAuth } from '@electron/repositories/slack/slack';
import { useMachine } from '@client/machines';
import { appMachine, AppSend, AppState, defaultAppSettings } from '@client/machines/app/appMachine';
import { appOptions } from '@client/machines/app/appOptions';
import { logger } from '@electron/services/logger';
import { isDev } from '@shared/constants';
import { useConfig } from './config';
import { useBridge } from './bridge';

export const useTimer = (): TimerHook => {
  const { config } = useConfig();
  const bridge = useBridge();

  const slackAuth: SlackAuth | null = config.slack.enabled
    ? {
        token: config.slack.slackToken,
        dCookie: config.slack.slackDCookie,
        dSCookie: config.slack.slackDSCookie,
      }
    : null;

  const [state, send] = useMachine(appMachine, {
    devTools: isDev,
    context: {
      ...defaultAppSettings,
      timers: config.timers,
    },
    ...appOptions({
      actions: {
        runTickHook: (_, { timeLeft: { mins, seconds } }) => {
          bridge.setTrayTitle(`${mins}:${seconds >= 10 ? seconds : `0${seconds}`}`);

          if (seconds === 0 && mins > 0) {
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + mins);

            if (slackAuth) {
              bridge.slackSetProfile(slackAuth, {
                text: mins === 1 ? `free in 1 min` : `free in ${mins} mins`,
                emoji: ':tomato:',
                expiration,
              });
            }
          }
        },
        runStartHooks: () => {
          logger.info('start hooks called');

          const duration = config.timers.pomo;

          const expiration = new Date();
          expiration.setMinutes(expiration.getMinutes() + duration);

          bridge.setTrayIcon('active');

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
        runEndHooks: () => {
          logger.info('end hooks called');
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
      },
    }),
  });

  return { state, send };
};

export interface TimerHook {
  state: AppState;
  send: AppSend;
}
