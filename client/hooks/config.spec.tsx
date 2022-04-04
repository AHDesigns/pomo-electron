import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Providers, waitFor, act } from '@test/rtl';
import { DeepPartial, emptyConfig, UserConfig } from '@shared/types';
import { err, ok } from '@shared/Result';
import { merge } from '@shared/merge';
import { createMockFn } from '@test/createMockFn';
import { Repositories } from '@electron/repositories';
import { useConfig } from './config';

describe('useConfig', () => {
  describe('when the config fails to load from disk', () => {
    it('should return loading false and default config', async () => {
      const spy = jest.fn();

      const { result } = renderHook(() => useConfig(), {
        wrapper: ({ children }) => (
          <Providers
            bridge={{
              storeRead: async () => err('oh no!'),
              warn: spy,
            }}
          >
            {children}
          </Providers>
        ),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.config).toBe(emptyConfig);
      expect(spy).toHaveBeenCalledWith('oh no!');
    });
  });

  describe('when the config loads succesfully', () => {
    const config: UserConfig = {
      ...emptyConfig,
      timers: { long: 23, short: 888, pomo: 11 },
    };

    it('should return loading false and config from disk', async () => {
      const { result } = renderHook(() => useConfig(), {
        wrapper: ({ children }) => (
          <Providers
            bridge={{
              storeRead: async () => ok(config),
            }}
          >
            {children}
          </Providers>
        ),
      });

      expect(result.current.loading).toBe(true);
      expect(result.current.config).toBe(null);

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.config).toStrictEqual(config);
    });

    describe('when config is updated', () => {
      it('should persist', async () => {
        const spy = createMockFn<Repositories['storeUpdate']>().mockResolvedValue(
          ok(merge(emptyConfig, { timers: { pomo: 612 } }))
        );

        const { result } = renderHook(() => useConfig(), {
          wrapper: ({ children }) => (
            <Providers
              bridge={{
                storeRead: async () => ok(config),
                storeUpdate: spy,
              }}
            >
              {children}
            </Providers>
          ),
        });

        await waitFor(() => expect(result.current.loading).toBe(false));
        const updated: DeepPartial<UserConfig> = {
          timers: { long: 42 },
        };

        act(() => {
          result.current.storeUpdate(updated);
        });

        expect(spy).toHaveBeenCalledWith(updated);

        await waitFor(() => expect(result.current.config?.timers.pomo).toBe(612));
      });
    });

    it('should be resetable', async () => {
      const { result } = renderHook(() => useConfig(), {
        wrapper: ({ children }) => (
          <Providers
            bridge={{
              storeRead: async () => ok(config),
            }}
          >
            {children}
          </Providers>
        ),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      act(() => {
        result.current.storeReset();
      });

      await waitFor(() => expect(result.current.config).toStrictEqual(emptyConfig));
    });
  });
});
