import { autoUpdater as _autoUpdater } from 'electron-updater';
import { createFakeLogger } from '../logger/createFakeLogger';
import { checkForUpdates } from './updater';

jest.mock('electron-updater', () => ({
  autoUpdater: {
    checkForUpdatesAndNotify: jest.fn(async () => Promise.resolve(undefined)),
    on: jest.fn(),
  },
}));
const autoUpdater = jest.mocked(_autoUpdater, true);
autoUpdater.on.mockImplementation((key, cb) => autoUpdater);

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
