import { createModel } from 'xstate/lib/model';

const pomodoroModel = createModel(
  {
    name: 'terry',
  },
  {
    events: {
      begin: (name: string) => ({ name }),
    },
  }
);

export default pomodoroModel;
