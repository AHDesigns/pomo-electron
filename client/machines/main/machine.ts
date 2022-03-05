import { IBridge } from '@shared/types';
import { forwardTo, InterpreterFrom } from 'xstate';
import configMachine from '../config/machine';
import pomodoroMachine, { IPomodoroMachine } from '../pomodoro/machine';
import mainModel from './model';

export interface IMainMachine {
  pomodoro: IPomodoroMachine;
  bridge: IBridge;
}

const mainMachineFactory = ({ pomodoro, bridge }: IMainMachine) =>
  mainModel.createMachine({
    id: 'main',
    type: 'parallel',
    on: {
      CONFIG_LOADED: {
        actions: [forwardTo('pomodoro-actor')],
      },
    },
    states: {
      pomodoro: {
        invoke: {
          id: 'pomodoro-actor',
          src: pomodoroMachine(pomodoro),
        },
      },
      config: {
        invoke: {
          id: 'config-actor',
          src: configMachine({ bridge }),
        },
      },
    },
  });

export type MainMachine = ReturnType<typeof mainMachineFactory>;
export type MainService = InterpreterFrom<MainMachine>;

export default mainMachineFactory;
