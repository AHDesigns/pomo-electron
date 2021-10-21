import { ActorRefFrom, assign, sendParent } from 'xstate';
import { pomodoroModel } from './pomodoroModel';
import { timerModel } from './timerModel';

const timerMachine = timerModel.createMachine(
  {
    id: 'timer',
    context: timerModel.initialContext,
    initial: 'ready',
    states: {
      ready: {
        entry: 'setTimer',
        always: {
          cond: ({ autoStart }) => autoStart,
          target: 'counting',
        },
        on: {
          play: 'counting',
        },
        exit: sendParent(({ timeLeft }) => pomodoroModel.events.start(timeLeft)),
      },
      counting: {
        on: {
          pause: 'paused',
          stop: 'stopped',
          complete: 'complete',
        },
        after: {
          ONE_SECOND: [
            {
              cond: 'isComplete',
              target: 'complete',
            },
            {
              actions: [
                'decrement1Second',
                sendParent(({ timeLeft }) => pomodoroModel.events.tick(timeLeft)),
              ],
              target: 'counting',
            },
          ],
        },
      },
      paused: {
        entry: [sendParent(pomodoroModel.events.pause())],
        on: {
          play: {
            actions: [sendParent(({ timeLeft }) => pomodoroModel.events.play(timeLeft))],
            target: 'counting',
          },
          stop: 'stopped',
        },
      },
      complete: {
        entry: [sendParent(pomodoroModel.events.complete())],
        always: 'ready',
      },
      stopped: {
        entry: [sendParent(pomodoroModel.events.stop())],
        always: 'ready',
      },
    },
  },
  {
    delays: {
      ONE_SECOND: 1000,
    },
    guards: {
      isComplete: ({ timeLeft: { mins, seconds } }) => mins === 0 && seconds === 1,
    },
    actions: {
      setTimer: assign({
        timeLeft: ({ duration }) => ({
          mins: duration,
          seconds: 0,
        }),
      }),
      decrement1Second: assign({
        timeLeft: ({ timeLeft: { mins, seconds } }) =>
          seconds === 0 ? { mins: mins - 1, seconds: 59 } : { mins, seconds: seconds - 1 },
      }),
    },
  }
);

export type TimerActor = ActorRefFrom<typeof timerMachine>;
export type TimeLeft = TimerActor['state']['context']['timeLeft'];

export default timerMachine;
