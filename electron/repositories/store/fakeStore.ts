import { ok } from '@shared/Result';
import merge from 'lodash.merge';
import { StoreConfig, StoreRepository } from './store';

export const fakeStoreRepoFactory = <T>(storeConfig: StoreConfig<T>): StoreRepository<T> => {
  let store = storeConfig.defaults;
  return {
    async storeRead() {
      return Promise.resolve(ok(store));
    },
    async storeUpdate(updatedStore) {
      merge(store, updatedStore);
      return Promise.resolve(ok(store));
    },
    async storeReset() {
      store = storeConfig.defaults;
      return Promise.resolve(ok(store));
    },
  };
};
