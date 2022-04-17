import { TimerHooks } from '@shared/types';

export const osHooks: TimerHooks = {
  onTickHook: ({ bridge, timer: { minutes, seconds } }) => {
    bridge.setTrayTitle(`${minutes}:${seconds >= 10 ? seconds : `0${seconds}`}`);
  },
  onStartHook: ({ bridge }) => {
    bridge.setTrayIcon('active');
  },
  onPauseHook: () => {},
  onPlayHook: () => {},
  onStopHook: ({ bridge }) => {
    bridge.setTrayTitle('');
    bridge.setTrayIcon('inactive');
  },
  onCompleteHook: ({ bridge }) => {
    bridge.windowFocus();
    bridge.setTrayTitle('');
    bridge.setTrayIcon('inactive');
  },
};
