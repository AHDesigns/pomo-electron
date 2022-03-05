import { ActorRefFrom } from 'xstate';
import model from './model';

const ONE_SECOND = 1000;

const timerMachine = model.createMachine(
  {
    id: 'timer',
    initial: 'ready',
    context: model.initialContext,
    states: {
      ready: {
        on: {
          START: { target: 'playing', actions: ['onStartHook'] },
        },
      },
      playing: {
        invoke: {
          id: 'second-timer',
          src: 'countOneSecond',
        },
        on: {
          _TICK: [
            { cond: 'isTimerFinished', target: 'complete' },
            { actions: ['updateTimer', 'onTickHook'], target: 'playing' },
          ],
          PAUSE: 'paused',
          STOP: 'stopped',
        },
      },
      paused: {
        entry: ['onPauseHook'],
        on: {
          PLAY: { target: 'playing', actions: ['onPlayHook'] },
          STOP: 'stopped',
        },
      },
      complete: {
        entry: ['onCompleteHook'],
        data: { complete: true },
        type: 'final',
      },
      stopped: {
        entry: ['onStopHook'],
        data: { complete: false },
        type: 'final',
      },
    },
  },
  {
    services: {
      countOneSecond: () => (sendBack) => {
        const id = setInterval(() => sendBack('_TICK'), ONE_SECOND);
        return () => clearInterval(id);
      },
    },
    guards: {
      isTimerFinished: ({ minutes, seconds }) => minutes === 0 && seconds === 1,
    },
    actions: {
      updateTimer: model.assign(({ minutes, seconds }) =>
        seconds === 0 ? { minutes: minutes - 1, seconds: 59 } : { minutes, seconds: seconds - 1 }
      ),
    },
  }
);

export type TimerActorRef = ActorRefFrom<typeof timerMachine>;

export default timerMachine;
