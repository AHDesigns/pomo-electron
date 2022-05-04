import { createFakeBridge } from '@electron/ipc/createFakeBridge';
import { merge } from '@shared/merge';
import { DeepPartial, emptyConfig, UserConfig } from '@shared/types';
import { createMachine, interpret } from 'xstate';
import { waitFor } from 'xstate/lib/waitFor';
import configMachine, { configModel } from '../config/machine';
import { actorIds } from '../constants';
import mainModel from '../main/model';
import { parentMachine } from '../testHelpers/machines';
import { getActor } from '../utils';
import { ITimerSettings, timerSettingsFactory } from './machine';
import timerSettingsModel, { TimerSettingsContext } from './model';

const { TIMER_SETTINGS, CONFIG } = actorIds;
const { CANCEL, UPDATE } = timerSettingsModel.events;

const config: UserConfig = merge(emptyConfig, {
  timers: {
    long: 22,
    pomo: 11,
    short: 33,
  },
});

describe('timerSettings machine', () => {
  async function setupTest() {
    const parent = parentMachine({
      id: CONFIG,
      childMachine: configMachine,
      parentEvents: Object.keys(mainModel.events),
      args: {
        bridge: createFakeBridge(),
        configOverride: config,
      },
    });

    const service = interpret(parent);
    service.start();
    const configService = getActor(service, CONFIG);
    await waitFor(configService, (m) => !m.hasTag('loading'), { timeout: 100 });
    const timerSettingsMachine = getActor(configService, TIMER_SETTINGS);

    return {
      parent: service,
      timerSettingsMachine,
    };
  }

  it('should start idle with the current timer settings', async () => {
    const { timerSettingsMachine } = await setupTest();

    const c = timerSettingsMachine.getSnapshot();

    expect(c?.hasTag('idle')).toBe(true);
    expect(c?.context.pomo).toBe(config.timers.pomo);
  });

  describe('when the user makes a valid edit', () => {
    it('should allow the user to make multiple changes and continue to update', async () => {
      const { timerSettingsMachine } = await setupTest();

      timerSettingsMachine.send(timerSettingsModel.events.UPDATE('pomo', 77));

      const c = timerSettingsMachine.getSnapshot();

      expect(c?.context.pomo).toBe(77);
      expect(c?.hasTag('editing')).toBe(true);

      timerSettingsMachine.send(timerSettingsModel.events.UPDATE('pomo', 29));

      const c2 = timerSettingsMachine.getSnapshot();
      expect(c2?.context.pomo).toBe(29);
      expect(c2?.hasTag('editing')).toBe(true);
    });

    it('should allow the user cancel the changes and return to an idle state', async () => {
      const { timerSettingsMachine } = await setupTest();

      timerSettingsMachine.send(UPDATE('pomo', 77));

      const c = timerSettingsMachine.getSnapshot();

      expect(c?.context.pomo).toBe(77);

      timerSettingsMachine.send(CANCEL());

      const c2 = timerSettingsMachine.getSnapshot();
      expect(c?.can('CANCEL')).toBe(true);
    });

    it.todo('should allow the user to submit the changes');
  });

  describe('when the user submits changes', () => {
    it.todo('should set the state to idle');
  });

  describe('when the user makes an invalid edit', () => {
    it.todo('should allow the user cancel the changes');
    it.todo('should report errors for each error');
    it.todo('should prevent the user submitting the changes');

    describe('once the user corrects all errors', () => {
      it.todo('should allow the user cancel the changes');
      it.todo('should allow the user to submit the changes');
    });
  });
});
