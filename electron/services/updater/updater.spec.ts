import { mocked } from 'ts-jest/utils';
import { autoUpdater as _autoUpdater } from 'electron-updater';
import { createFakeLogger } from '../logger';
import { checkForUpdates } from './updater';

const autoUpdater = mocked(_autoUpdater, true);

describe('checkForUpdates', () => {
  const spy = jest.fn();
  const logger = createFakeLogger({
    errorWithContext: () => spy,
  });

  beforeEach(() => {
    checkForUpdates(logger);
  });

  it("sets the updater's logger correctly", () => {
    expect(autoUpdater.logger).toBe(logger);
  });

  it('checks for updates', () => {
    expect(autoUpdater.checkForUpdatesAndNotify).toHaveBeenCalled();
  });

  describe('when update errors', () => {
    const err = new Error('poop');

    beforeAll(() => {
      autoUpdater.checkForUpdatesAndNotify.mockRejectedValue(err);
    });

    it('catches and logs error', () => {
      expect(spy).toHaveBeenCalledWith(err);
    });
  });
});
