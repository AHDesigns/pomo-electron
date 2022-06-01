import Store, { type Options } from 'electron-store';
import { err, ok, Result } from '@shared/Result';
import { DeepPartial, ILogger, UserConfig } from '@shared/types';
import { getKeyPathsAndValues } from './getKeyPathsAndValues';

export interface StoreRepository<T> {
  storeRead(): Promise<Result<T>>;
  storeUpdate(value: DeepPartial<T>): Promise<Result<T>>;
  storeReset(): Promise<Result<T>>;
}

export interface StoreConfig<T> {
  /**
   * Name of the config file to be created
   *
   * e.g `Foo` will become Foo.json
   */
  name: string;
  /**
   * Directory for the config file, sensible default for Operating System if none provided
   */
  cwd?: string;
  /**
   * Initial values for config, if no config file exists
   */
  defaults: T;
  migrations?: Options<T>['migrations'];
}

export interface StoreRepo<T> {
  storeConfig: StoreConfig<T>;
  logger: ILogger;
}

export const storeRepository = <T = UserConfig>({
  logger,
  storeConfig,
}: StoreRepo<T>): StoreRepository<T> => {
  const { name, cwd } = storeConfig;

  logger.info(`setting up Store Repo: name "${name}"${cwd ? ` cwd "${cwd}"` : ''}`);

  const store = new Store<T>(storeConfig);
  logger.debug(store.path);

  return {
    async storeRead() {
      logger.info('reading store', store.store);
      return Promise.resolve(ok(store.store));
    },
    async storeReset() {
      store.clear();
      return Promise.resolve(ok(store.store));
    },
    async storeUpdate(updatedStore) {
      const originalStore = store.store;
      try {
        getKeyPathsAndValues(updatedStore).forEach(([path, value]) => {
          store.set(path, value);
        });
        return await Promise.resolve(ok(store.store));
      } catch (e: unknown) {
        logger.warn(
          `failed to update store "${name}", err:\n${
            /* istanbul ignore next */
            e instanceof Error ? e.message : 'unknownError'
          }`
        );
        store.set(originalStore);
        return Promise.resolve(err('failed to update'));
      }
    },
  };
};
