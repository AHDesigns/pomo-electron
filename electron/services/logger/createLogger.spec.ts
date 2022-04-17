import _log, { LevelOption } from 'electron-log';
import { Nodenv } from '@shared/asserts';
import type { ILogger } from '@shared/types';
import * as _constants from '@shared/constants';
import { createLogger, loggerErrorHandler } from './createLogger';

jest.mock('electron-log');
jest.mock('@shared/constants');
const log = jest.mocked(_log, true);
const constants = jest.mocked(_constants, true);

describe('createLogger', () => {
  const error = new Error('poop');
  let logger: ILogger;

  beforeAll(() => {
    constants.nodenv = 'test';
  });

  beforeEach(() => {
    logger = createLogger(_log);
  });

  interface Collection {
    nodenv: Nodenv;
    fileLevel: LevelOption;
    consoleLevel: LevelOption;
  }
  const logLevels: Collection[] = [
    { nodenv: 'development', fileLevel: false, consoleLevel: 'silly' },
    { nodenv: 'test', fileLevel: false, consoleLevel: 'silly' },
    { nodenv: 'production', fileLevel: 'info', consoleLevel: false },
    { nodenv: 'impossible' as Nodenv, fileLevel: 'info', consoleLevel: 'info' },
  ];

  logLevels.forEach(({ nodenv, consoleLevel, fileLevel }) => {
    describe(`when nodenv is ${nodenv}`, () => {
      beforeAll(() => {
        constants.nodenv = nodenv;
      });

      it('sets transports correctly', () => {
        expect(log.transports.file.level).toBe(fileLevel);
        expect(log.transports.console.level).toBe(consoleLevel);
      });

      afterAll(() => {
        constants.nodenv = 'test';
      });
    });
  });

  describe('when in integration mode', () => {
    beforeAll(() => {
      constants.nodenv = 'production';
      constants.isIntegration = true;
    });

    it('sets transports correctly', () => {
      expect(log.transports.console.level).toBe('info');
    });

    afterAll(() => {
      constants.nodenv = 'test';
      constants.isIntegration = false;
    });
  });

  it('errorWithContext logs errors', () => {
    logger.errorWithContext('context')(error);
    expect(log.error).toHaveBeenCalledWith('context', error);
  });

  it('sets up uncaught error handler', () => {
    expect(log.catchErrors).toHaveBeenCalledWith({
      showDialog: false,
      onError: loggerErrorHandler,
    });
  });

  it('logs the initialised state', () => {
    expect(log.info).toHaveBeenCalledWith(expect.any(String), expect.any(String));
  });
});
