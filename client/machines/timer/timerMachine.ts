import { ActorContext, ActorRefFrom, assign, ContextFrom, sendParent } from 'xstate';
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
        exit: sendParent(({ timeLeft, timerType }) =>
          pomodoroModel.events.start({ ...timeLeft, timer: timerType })
        ),
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
                sendParent(({ timeLeft, timerType }) =>
                  pomodoroModel.events.tick({ ...timeLeft, timer: timerType })
                ),
              ],
              target: 'counting',
            },
          ],
        },
      },
      paused: {
        entry: [
          sendParent(({ timeLeft, timerType }) =>
            pomodoroModel.events.pause({ ...timeLeft, timer: timerType })
          ),
        ],
        on: {
          play: {
            actions: [
              sendParent(({ timeLeft, timerType }) =>
                pomodoroModel.events.play({ ...timeLeft, timer: timerType })
              ),
            ],
            target: 'counting',
          },
          stop: 'stopped',
        },
      },
      complete: {
        entry: [
          sendParent(({ timeLeft, timerType }) =>
            pomodoroModel.events.complete({ ...timeLeft, timer: timerType })
          ),
        ],
        type: 'final',
      },
      stopped: {
        entry: [
          sendParent(({ timeLeft, timerType }) =>
            pomodoroModel.events.stop({ ...timeLeft, timer: timerType })
          ),
        ],
        type: 'final',
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

type TimerFactoryConfig = Pick<ContextFrom<typeof timerModel>, 'duration'>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export function createTimerMachine({ duration }: TimerFactoryConfig) {
  return timerMachine.withContext({
    timerType: 'pomo',
    autoStart: false,
    timeLeft: { mins: 0, seconds: 0 },
    duration,
  });
}

export default timerMachine;
