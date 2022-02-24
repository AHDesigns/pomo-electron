import model from './model';

const machine = model.createMachine({
  initial: 'pomodoro',
  type: 'parallel',
  states: {
    menu: {
      initial: 'closed',
      states: {
        closed: {
          on: { VIEW_TOGGLE_MENU: 'open' },
        },
        open: {
          on: { VIEW_TOGGLE_MENU: 'closed' },
        },
      },
    },
    window: {
      initial: 'pomodoro',
      on: {
        VIEW_TIMER: '.pomodoro',
        VIEW_SETTINGS: '.settings',
      },
      states: {
        pomodoro: {},
        settings: {},
      },
    },
  },
});

export default machine;
