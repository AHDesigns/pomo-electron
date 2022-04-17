/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { merge } from '@shared/merge';
import { err, ok } from '@shared/Result';
import { DeepPartial, emptyConfig, IBridge, UserConfig } from '@shared/types';
import { createMockFn } from '@test/createMockFn';
import { createMachine, interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import { actorIds } from '../constants';
import { MainEvents } from '../main/model';
import { getActor } from '../utils';
import configMachineFactory, { configModel } from './machine';

const { CONFIG } = actorIds;
const { UPDATE, RESET } = configModel.events;

interface TestOverrides {
  /**
   * Don't wait for the machine to have left the 'loading' state
   */
  dontWait?: true;
  bridge?: Partial<IBridge>;
  config?: DeepPartial<UserConfig>;
}

async function runTest(overrides?: TestOverrides) {
  const spy = jest.fn();

  const { bridge, config, dontWait } = overrides ?? {};
  const parent = createMachine(
    {
      id: 'parent',
      tsTypes: {} as import('./machine.spec.typegen').Typegen0,
      schema: {
        events: {} as MainEvents,
      },
      initial: 'running',
      states: {
        running: {
          on: {
            CONFIG_LOADED: { actions: 'spy' },
          },
          invoke: {
            id: CONFIG,
            src: configMachineFactory({
              bridge: createFakeBridge(bridge),
              configOverride: config && merge(emptyConfig, config),
            }),
          },
        },
      },
    },
    {
      actions: {
        spy: (_, e) => spy(e),
      },
    }
  );

  const service = interpret(parent);
  service.start();
  const configMachine = getActor(service, CONFIG);

  if (!dontWait) {
    await waitFor(configMachine, ({ value }) => value === 'loaded', { timeout: 100 });
  }

  return {
    parent: service,
    configMachine,
    spy,
  };
}

describe('config machine', () => {
  it('should start in a loading state', async () => {
    const { configMachine } = await runTest({ dontWait: true });

    expect(configMachine.getSnapshot()?.value).toBe('loading');
  });

  describe('when config fails to load', () => {
    it('should return the default config, broadcast it and log a warning', async () => {
      const spy = jest.fn();

      const { configMachine, spy: storeSpy } = await runTest({
        bridge: {
          warn: spy,
          storeRead: async () => err('oh no!'),
        },
      });

      const { context } = configMachine.getSnapshot() ?? {};
      expect(context).toBe(emptyConfig);
      expect(spy).toHaveBeenCalledWith('oh no!');
      expect(storeSpy).toHaveBeenCalledWith({
        type: expect.anything(),
        data: emptyConfig,
      });
    });
  });

  describe('when config loads', () => {
    it("should return the user's config and broadcast it", async () => {
      const { configMachine, spy: storeSpy } = await runTest({
        bridge: {
          storeRead: async () => ok(merge(emptyConfig, { timers: { pomo: 612 } })),
        },
      });

      const { context } = configMachine.getSnapshot() ?? {};
      expect(context?.timers.pomo).toBe(612);
      expect(storeSpy).toHaveBeenCalledWith({
        type: expect.anything(),
        data: expect.objectContaining({
          timers: expect.objectContaining({ pomo: 612 }),
        }),
      });
    });
  });

  describe("when config is DI'd", () => {
    it('should return the users config', async () => {
      const storeSpy = jest.fn();

      const { configMachine } = await runTest({
        bridge: {
          storeRead: storeSpy,
        },
        config: {
          timers: { pomo: 2222 },
        },
      });

      expect(storeSpy).not.toHaveBeenCalled();
      const { context } = configMachine.getSnapshot() ?? {};
      expect(context?.timers.pomo).toBe(2222);
    });
  });

  describe('when config is updated', () => {
    it('should update the config and broadcast the change', async () => {
      const updatedConfig = merge(emptyConfig, { timers: { pomo: 222 } });
      const mock = createMockFn<IBridge['storeUpdate']>().mockResolvedValue(ok(updatedConfig));
      const { configMachine, spy } = await runTest({
        bridge: {
          storeRead: async () => ok(merge(emptyConfig, { timers: { pomo: 612 } })),
          storeUpdate: mock,
        },
      });

      const update = { slack: { enabled: true, slackToken: 'Wubba Lubba Dub Dub!' } };

      configMachine.send(UPDATE(update));

      const { value } = configMachine.getSnapshot() ?? {};
      expect(value).toBe('updating');

      await waitFor(configMachine, (c) => c.value === 'loaded');

      const { context } = configMachine.getSnapshot() ?? {};
      expect(context?.timers.pomo).toBe(222);
      expect(mock).toHaveBeenCalledWith(update);
      expect(spy).toHaveBeenLastCalledWith({
        data: updatedConfig,
        type: expect.anything(),
      });
    });
  });

  describe('when config is reset', () => {
    it('should reset the config and broadcast the change', async () => {
      const updatedConfig = merge(emptyConfig, { timers: { pomo: 222 } });
      const { configMachine, spy } = await runTest({
        bridge: {
          storeReset: async () => ok(updatedConfig),
        },
      });

      configMachine.send(RESET());

      const { value } = configMachine.getSnapshot() ?? {};
      expect(value).toBe('resetting');

      await waitFor(configMachine, (c) => c.value === 'loaded');

      const { context } = configMachine.getSnapshot() ?? {};
      expect(context?.timers.pomo).toBe(222);
      expect(spy).toHaveBeenLastCalledWith({
        data: updatedConfig,
        type: expect.anything(),
      });
    });
  });
});
