import React, { FC } from 'react';
import { useConfig } from '@client/components/useConfig';
import { SlackAuth } from '@electron/repositories/slack/slack';
import { useMachine } from '@client/machines';
import { appMachine, defaultAppSettings } from '@client/machines/app/appMachine';
import { isDev } from '@shared/constants';
import { appOptions } from '@client/machines/app/appOptions';
import { logger } from '@electron/services/logger';
import { Timer } from '@client/components/Timer';

export const Pomodoro: FC = () => {
  const { config } = useConfig();

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
          window.bridge.setTrayTitle(`${mins}:${seconds >= 10 ? seconds : `0${seconds}`}`);

          if (seconds === 0 && mins > 0) {
            const expiration = new Date();
            expiration.setMinutes(expiration.getMinutes() + mins);

            if (slackAuth) {
              window.bridge.slackSetProfile(slackAuth, {
                text: mins === 1 ? `free in 1 min` : `free in ${mins} mins`,
                emoji: ':eggplant:',
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

          window.bridge.setTrayIcon('active');

          if (slackAuth) {
            window.bridge.slackSetPresence(slackAuth, 'away');
            window.bridge.slackSetSnooze(slackAuth, duration);
            window.bridge.slackSetProfile(slackAuth, {
              text: `free in ${config.timers.pomo} mins`,
              emoji: ':tomato:',
              expiration,
            });
          }
        },
        runEndHooks: () => {
          logger.info('end hooks called');
          window.bridge.windowFocus();
          window.bridge.setTrayTitle('');
          window.bridge.setTrayIcon('inactive');

          if (slackAuth) {
            window.bridge.slackSetPresence(slackAuth, 'active');
            window.bridge.slackSetSnooze(slackAuth, 0);
            window.bridge.slackSetProfile(slackAuth, {
              text: '',
              emoji: '',
            });
          }
        },
      },
    }),
  });

  const {
    autoStart: { beforeLongBreak, beforePomo, beforeShortBreak },
    timers: { longBreak, shortBreak, pomo },
  } = state.context;

  return (
    <>
      {state.matches('pomo') && (
        <Timer duration={pomo} appSend={send} title="pomodoro" autoStart={beforePomo} />
      )}
      {state.matches('shortBreak') && (
        <Timer duration={shortBreak} appSend={send} title="break" autoStart={beforeShortBreak} />
      )}
      {state.matches('longBreak') && (
        <Timer appSend={send} duration={longBreak} title="long break" autoStart={beforeLongBreak} />
      )}
    </>
  );
};
