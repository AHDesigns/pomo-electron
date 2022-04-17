import log from 'electron-log';
import * as electron from 'electron';
import { createLogger } from './createLogger';
import { errorHandler } from './errorHandler';

jest.mock('electron-log');

const { app, dialog } = jest.mocked(electron, true);

describe('errorHandler', () => {
  const error = new Error('poop');
  error.stack = 'error stack for poop';
  const defaultVersions = { os: 'mac', electron: '1', app: 'pancake' };
  let versions: typeof defaultVersions | undefined;
  let submitIssue: jest.Mock | undefined = jest.fn();
  const errorSpy = jest.fn();
  const logger = {
    ...createLogger(log),
    errorWithContext: () => errorSpy,
  };

  beforeEach(() => {
    const appliedErrorHandler = errorHandler(logger);
    appliedErrorHandler?.(error, versions, submitIssue);
  });

  it('creates a message box for the user', () => {
    expect(dialog.showMessageBox).toHaveBeenCalledWith({
      title: 'An error occurred',
      message: error.message,
      detail: error.stack,
      type: 'error',
      buttons: ['Ignore', 'Report', 'Exit'],
    });
  });

  describe('when the user chooses to ignore the error', () => {
    beforeAll(() => {
      dialog.showMessageBox.mockResolvedValue({
        response: 3,
        checkboxChecked: false,
      });
    });

    it('does nothing', () => {
      expect(submitIssue).not.toHaveBeenCalled();
      expect(app.quit).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('when the user chooses to quit', () => {
    beforeAll(() => {
      dialog.showMessageBox.mockResolvedValue({
        response: 2,
        checkboxChecked: false,
      });
    });

    it('does not log a report', () => {
      expect(submitIssue).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });

    it('quits the app', () => {
      expect(app.quit).toHaveBeenCalled();
    });
  });

  describe('when the user chooses to report the error', () => {
    beforeAll(() => {
      dialog.showMessageBox.mockResolvedValue({
        response: 1,
        checkboxChecked: false,
      });
    });

    it('does not quit the app', () => {
      expect(errorSpy).not.toHaveBeenCalled();
      expect(app.quit).not.toHaveBeenCalled();
    });

    describe('and all details are provided by electron', () => {
      beforeAll(() => {
        versions = defaultVersions;
      });

      it('opens a github issue', () => {
        expect(submitIssue).toHaveBeenCalledWith(
          'https://github.com/AHDesigns/pancake-electron/issues/new',
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          {
            title: expect.any(String),
            body: expect.any(String),
            labels: 'to refine, bug',
          }
          /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        );
        expect(submitIssue?.mock.calls[0]).toMatchSnapshot();
      });
    });

    describe('and no details are provided by electron', () => {
      beforeAll(() => {
        versions = undefined;
      });

      it('opens a github issue', () => {
        expect(submitIssue).toHaveBeenCalledWith(
          'https://github.com/AHDesigns/pancake-electron/issues/new',
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          {
            title: expect.any(String),
            body: expect.any(String),
            labels: 'to refine, bug',
          }
          /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        );
        expect(submitIssue?.mock.calls[0]).toMatchSnapshot();
      });
    });

    describe('and no stack trace is provided', () => {
      beforeAll(() => {
        versions = undefined;
        error.stack = undefined;
      });

      it('opens a github issue', () => {
        expect(submitIssue).toHaveBeenCalledWith(
          'https://github.com/AHDesigns/pancake-electron/issues/new',
          /* eslint-disable @typescript-eslint/no-unsafe-assignment */
          {
            title: expect.any(String),
            body: expect.stringContaining('No stacktrace'),
            labels: 'to refine, bug',
          }
          /* eslint-enable @typescript-eslint/no-unsafe-assignment */
        );
        expect(submitIssue?.mock.calls[0]).toMatchSnapshot();
      });
    });

    describe('when no submit function is provided', () => {
      beforeAll(() => {
        submitIssue = undefined;
      });

      it('does nothing', () => {
        expect(app.quit).not.toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
      });

      afterAll(() => {
        submitIssue = jest.fn();
      });
    });

    describe('when submit issue fails', () => {
      const err = new Error('poop');
      beforeAll(() => {
        dialog.showMessageBox.mockRejectedValue(err);
      });

      it('does not quit', () => {
        expect(app.quit).not.toHaveBeenCalled();
      });

      it('logs the exception', () => {
        expect(errorSpy).toHaveBeenCalledWith(err);
      });
    });
  });
});
