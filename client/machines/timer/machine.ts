import { ActorRefFrom, assign, createMachine } from 'xstate';
import { sendParent } from 'xstate/lib/actions';
import pomodoroModel from '../pomodoro/model';
import model, { TimerContext, TimerEvents } from './model';

const ONE_SECOND = 1000;

const timerMachine = createMachine(
  {
    id: 'timer',
    initial: 'ready',
    tsTypes: {} as import('./machine.typegen').Typegen0,
    schema: {
      events: {} as TimerEvents,
      context: {} as TimerContext,
    },
    context: model.initialContext,
    states: {
      ready: {
        always: [{ cond: 'shouldAutoStart', target: 'playing' }],
        on: {
          START: { target: 'playing' },
        },
        exit: 'onStartHook',
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
        entry: ['onCompleteHook', 'notifyParentComplete'],
        type: 'final',
      },
      stopped: {
        entry: ['onStopHook', 'notifyParentInComplete'],
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

      shouldAutoStart: ({ autoStart }) => autoStart,
    },
    actions: {
      updateTimer: assign(({ minutes, seconds }) =>
        seconds === 0 ? { minutes: minutes - 1, seconds: 59 } : { minutes, seconds: seconds - 1 }
      ),

      notifyParentComplete: sendParent(pomodoroModel.events.TIMER_COMPLETE(true)),

      notifyParentInComplete: sendParent(pomodoroModel.events.TIMER_INCOMPLETE(true)),
    },
  }
);

export type TimerActorRef = ActorRefFrom<typeof timerMachine>;

export default timerMachine;
