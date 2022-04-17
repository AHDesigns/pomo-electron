import { osHooks } from './os';
import { createCtx } from './createCtx';

describe('osHooks', () => {
  test('onStartHook updates tray timer', () => {
    const { ctx, spies } = createCtx();
    osHooks.onStartHook(ctx);

    expect(spies.setTrayIcon).toHaveBeenCalledWith('active');
  });

  test('onStopHook updates tray timer', () => {
    const { ctx, spies } = createCtx();
    osHooks.onStopHook(ctx);

    expect(spies.setTrayIcon).toHaveBeenCalledWith('inactive');
    expect(spies.setTrayTitle).toHaveBeenCalledWith('');
  });

  test('onTickHook updates tray timer', () => {
    const c = createCtx({ timer: { minutes: 4, seconds: 29 } });
    osHooks.onTickHook(c.ctx);

    expect(c.spies.setTrayTitle).toHaveBeenCalledWith('4:29');

    const c2 = createCtx({ timer: { minutes: 4, seconds: 2 } });
    osHooks.onTickHook(c2.ctx);

    expect(c2.spies.setTrayTitle).toHaveBeenCalledWith('4:02');
  });

  test('onCompleteHook updates tray timer and focusses the window', () => {
    const { ctx, spies } = createCtx();
    osHooks.onCompleteHook(ctx);

    expect(spies.setTrayTitle).toHaveBeenCalledWith('');
    expect(spies.setTrayIcon).toHaveBeenCalledWith('inactive');
  });
});
