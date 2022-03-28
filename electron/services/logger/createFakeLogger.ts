/* eslint-disable no-console */
import { IClientLogger, ILogger } from '@shared/types';

export function createFakeLogger(overrides?: Partial<ILogger>): ILogger {
  return {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ...({} as ILogger),
    error() {},
    warn() {},
    log() {},
    debug() {},
    info() {},
    silly() {},
    verbose() {},
    catchErrors() {
      return { stop() {} };
    },
    errorWithContext: () => () => {},
    ...overrides,
  };
}

export function createFakeClientLogger(): IClientLogger {
  return {
    error: () => {},
    warn: () => {},
    info: () => {},
  };
}
