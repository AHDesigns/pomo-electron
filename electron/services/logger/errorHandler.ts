import { ILogger } from '@shared/types';
import { app, dialog } from '@electron/electron';
import { CatchErrorsOptions } from 'electron-log';

export const errorHandler: (logger: ILogger) => CatchErrorsOptions['onError'] = (logger) => (
  error,
  versions,
  submitIssue
) => {
  dialog
    .showMessageBox({
      title: 'An error occurred',
      message: error.message,
      detail: error.stack,
      type: 'error',
      buttons: ['Ignore', 'Report', 'Exit'],
    })
    .then((result) => {
      if (result.response === 1) {
        const body = generateReport(error, versions);

        submitIssue?.('https://github.com/AHDesigns/pancake-electron/issues/new', {
          title: 'Error report',
          body,
          labels: 'to refine, bug',
        });
        return;
      }
      if (result.response === 2) {
        app.quit();
      }
    })
    .catch(logger.errorWithContext('error submitting issue'));
};

function generateReport(
  error: Error,
  versions?: {
    os: string;
    electron: string;
    app: string;
  }
): string {
  const appVersion = versions?.app ?? 'no app version';
  const electron = versions?.electron ?? 'no electron version';
  const os = versions?.os ?? 'no OS detected';
  const code = '```';
  const heading = '**Error Report:**';
  const stack = error.stack ? `Stacktrace: \n${code}\n${error.stack}\n${code}` : 'No stacktrace';

  return `**Describe the bug**
Describe as best you can when the error occured, with steps leading up to it if possible.
**Screenshots**
If possible, add screenshots to help explain your problem.
${heading}
${stack}
OS: ${os}
${electron}
${appVersion}`;
}
