import { sendParent } from 'xstate';
import timerModel from './model';
import pomoModel from '../pomodoro/model';

const timerMachine = timerModel.createMachine(
  {
    context: timerModel.initialContext,
    initial: 'counting',
    states: {
      counting: {
        meta: {
          description: 'spawns a machine to count a second',
        },
        invoke: {
          src: 'countOneSecond',
        },
        on: {
          TICK: [
            {
              cond: 'isTimerFinished',
              target: 'finished',
            },
            {
              actions: ['decrementOneSecond', 'updateParent'],
            },
          ],
          BUMP: { actions: ['addMinute'] },
          PAUSE: 'paused',
        },
      },
      paused: {
        on: {
          PLAY: 'counting',
        },
      },
      finished: {
        type: 'final',
      },
    },
  },
  {
    services: {
      countOneSecond: () => (sendBack) => {
        const interval = setInterval(() => {
          sendBack(timerModel.events.TICK());
        }, 1000);
        return () => {
          clearInterval(interval);
        };
      },
    },
    guards: {
      isTimerFinished: ({ minutes, seconds }) => minutes === 0 && seconds === 0,
    },
    actions: {
      decrementOneSecond: timerModel.assign(({ seconds, minutes }) => {
        if (seconds === 0) {
          return { minutes: minutes - 1, seconds: 59 };
        }
        return { minutes, seconds: seconds - 1 };
      }),
      addMinute: timerModel.assign({
        minutes: ({ minutes }) => minutes + 1,
      }),
      updateParent: sendParent(({ minutes, seconds }) =>
        pomoModel.events.TIMER_TICK(minutes, seconds)
      ),
    },
  }
);

export default timerMachine;
