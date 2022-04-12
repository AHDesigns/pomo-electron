import { createModel } from 'xstate/lib/model';

const view = createModel(
  {},
  {
    events: {
      VIEW_TIMER: () => ({}),
      VIEW_SETTINGS: () => ({}),
      VIEW_TOGGLE_MENU: () => ({}),
    },
  }
);

export default view;
