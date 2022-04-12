import { ILogger } from '@shared/types';
import { autoUpdater } from 'electron-updater';

export function checkForUpdates(logger: ILogger): void {
  autoUpdater.logger = logger;
  autoUpdater.checkForUpdatesAndNotify().catch(logger.errorWithContext('checking for updates'));
}
