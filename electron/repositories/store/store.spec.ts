import { createFakeLogger } from '@electron/services/logger/createFakeLogger';
import { err, ok } from '@shared/Result';
import * as fs from 'fs';

import { StoreRepo, storeRepository } from './store';

jest.unmock('electron');

describe('StoreRepository', () => {
  const storeFilePath = `${process.cwd()}/temp`;

  interface Schema {
    foo: {
      bar: { baz: number };
      ping?: string;
    };
    a: number;
    b?: string;
  }

  const schema: Schema = {
    foo: { bar: { baz: 3 } },
    a: 1,
    b: 'hi',
  };

  const defaultStoreOptions: StoreRepo<Schema> = {
    logger: createFakeLogger(),
    storeConfig: {
      defaults: schema,
      name: 'test',
      cwd: storeFilePath,
    },
  };

  afterEach((done) => {
    fs.rmdir(storeFilePath, { recursive: true }, (e) => {
      // eslint-disable-next-line no-console
      if (e) console.error(e);
      done();
    });
  });

  describe('#read', () => {
    it('should return the store contents', async () => {
      const store = storeRepository(defaultStoreOptions);
      const res = await store.storeRead();

      expect(res).toMatchResult(ok(schema));
    });
  });

  describe('#update', () => {
    describe('when update works', () => {
      it('should update the store with the new value and return the result', async () => {
        const store = storeRepository(defaultStoreOptions);
        const updateRes = await store.storeUpdate({
          a: 4,
          foo: { ping: 'bye' },
        });

        expect(updateRes).toMatchResult(
          ok({
            foo: {
              bar: { baz: 3 },
              ping: 'bye',
            },
            a: 4,
            b: 'hi',
          })
        );
        expect(updateRes).toMatchResult(await store.storeRead());
      });
    });

    describe('when update fails', () => {
      it('should roll back to the initial state and return an error', async () => {
        const store = storeRepository(defaultStoreOptions);
        const initialStore = await store.storeRead();
        const updateRes = await store.storeUpdate({ foo: { ping: 'bye' }, a: undefined });

        expect(updateRes).toMatchResult(err('failed to update'));
        expect(initialStore).toMatchResult(await store.storeRead());
      });
    });
  });

  describe('#reset', () => {
    it('should clear the store and reset all values to defaults', async () => {
      const store = storeRepository(defaultStoreOptions);
      await store.storeUpdate({
        a: 4,
        foo: { ping: 'bye' },
      });
      const res = await store.storeReset();

      expect(res).toMatchResult(ok(schema));
    });
  });
});
