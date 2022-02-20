import model from './model';

const pomodoroMachine = model.createMachine({
  context: model.initialContext,
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        begin: 'active',
      },
    },
    active: {
      type: 'final',
    },
  },
});

export default pomodoroMachine;
