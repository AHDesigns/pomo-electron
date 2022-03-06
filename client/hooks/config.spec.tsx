import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Providers, waitFor } from '@test/rtl';
import { emptyConfig, UserConfig } from '@shared/types';
import { err, ok } from '@shared/Result';
import { useConfig } from './config';

describe('useConfig', () => {
  describe('when the config loads succesfully', () => {
    it('should return loading false and config from disk', async () => {
      const config: UserConfig = {
        ...emptyConfig,
        timers: { long: 23, short: 888, pomo: 11 },
      };
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
  });

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
});
