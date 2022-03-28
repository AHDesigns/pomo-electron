import { IBridge } from '@shared/types';
import { assign, createMachine, forwardTo, InterpreterFrom } from 'xstate';
import configMachine from '../config/machine';
import { actorIds } from '../constants';
import pomodoroMachine, { IPomodoroMachine } from '../pomodoro/machine';
import mainModel, { MainContext, MainEvents } from './model';

export interface IMainMachine {
  pomodoro: IPomodoroMachine;
  bridge: IBridge;
}

const mainMachineFactory = ({ pomodoro, bridge }: IMainMachine) =>
  createMachine(
    {
      id: 'main',
      schema: {
        context: {} as MainContext,
        events: {} as MainEvents,
      },
      context: mainModel.initialContext,
      tsTypes: {} as import('./machine.typegen').Typegen0,
      type: 'parallel',
      on: {
        CONFIG_LOADED: {
          actions: [forwardTo(actorIds.POMODORO), 'setLoaded'],
        },
      },
      states: {
        // booting: {
        //   initial: 'starting',
        //   states: {
        //     starting: { always: 'ready' },
        //     ready: {
        //       entry: 'setLoaded',
        //       type: 'final',
        //     },
        //   },
        // },
        pomodoro: {
          invoke: {
            id: actorIds.POMODORO,
            src: pomodoroMachine(pomodoro),
          },
        },
        config: {
          invoke: {
            id: actorIds.CONFIG,
            src: configMachine({ bridge }),
          },
        },
      },
    },
    {
      actions: {
        setLoaded: assign({
          loaded: true,
        }),
      },
    }
  );

export type MainMachine = ReturnType<typeof mainMachineFactory>;
export type MainService = InterpreterFrom<MainMachine>;

export default mainMachineFactory;
