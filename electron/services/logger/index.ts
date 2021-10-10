import type { ILogger } from '@shared/types';

export { createLogger } from './createLogger';

export const createFakeLogger = (overrides?: Partial<ILogger>): ILogger => ({
  // eslint-disable-next-line
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
});
