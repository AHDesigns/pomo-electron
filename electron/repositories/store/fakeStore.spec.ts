import { ok } from '@shared/Result';
import { fakeStoreRepoFactory } from './fakeStore';
import { StoreConfig } from './store';

describe('fakeStoreRepo', () => {
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

  const defaultStoreOptions: StoreConfig<Schema> = {
    defaults: schema,
    name: 'test',
  };

  describe('#read', () => {
    it('should return the store', async () => {
      const store = fakeStoreRepoFactory(defaultStoreOptions);
      expect(await store.storeRead()).toMatchResult(ok(schema));
    });
  });

  describe('#read', () => {
    it('should return the store', async () => {
      const store = fakeStoreRepoFactory(defaultStoreOptions);
      expect(await store.storeRead()).toMatchResult(ok(schema));
    });
  });

  describe('#update', () => {
    it('should update the store with the new value and return the result', async () => {
      const store = fakeStoreRepoFactory(defaultStoreOptions);
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

  describe('#reset', () => {
    it('should clear the store and reset all values to defaults', async () => {
      const store = fakeStoreRepoFactory(defaultStoreOptions);
      await store.storeUpdate({
        a: 4,
        foo: { ping: 'bye' },
      });
      const res = await store.storeReset();

      expect(res).toMatchResult(ok(schema));
    });
  });
});
