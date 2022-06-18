import { ElectronLog, LevelOption } from 'electron-log';
import type { ILogger } from '@shared/types';
import { isIntegration, nodenv } from '@shared/constants';
import type { Nodenv } from '@shared/asserts';
import { errorHandler } from './errorHandler';

// eslint-disable-next-line import/no-mutable-exports
export let loggerErrorHandler: ReturnType<typeof errorHandler>;

type LogLevels = [Nodenv, LevelOption][];

const fileLogLevels: LogLevels = [
  ['development', false],
  ['test', false],
  ['production', 'info'],
];

const consoleLogLevels: LogLevels = [
  ['development', 'silly'],
  ['test', 'silly'],
  ['production', false],
];

/**
 * By default, it writes logs to the following locations:
 *
 * on Linux: ~/.config/{app name}/logs/{process type}.log
 * on macOS: ~/Library/Logs/{app name}/{process type}.log
 * on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log
 * @param log
 */
export function createLogger(log: ElectronLog): ILogger {
  // eslint-disable-next-line no-param-reassign
  log.transports.file.level = getLevel(fileLogLevels);
  // eslint-disable-next-line no-param-reassign
  log.transports.console.level = isIntegration ? 'info' : getLevel(consoleLogLevels);

  const logger: ILogger = {
    ...log,
    errorWithContext(context) {
      return (err) => {
        log.error(context, err);
      };
    },
  };

  loggerErrorHandler = errorHandler(logger);

  log.catchErrors({
    showDialog: false,
    onError: loggerErrorHandler,
  });

  logger.info(
    'Logger initialised',
    JSON.stringify({
      node: process.version,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      env: nodenv,
      integration: isIntegration,
      file: log.transports.file.level,
      console: log.transports.console.level,
    })
  );

  return logger;
}

function getLevel(levels: LogLevels): LevelOption {
  return levels.find(([setting]) => setting === nodenv)?.[1] ?? 'info';
}
