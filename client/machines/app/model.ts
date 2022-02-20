import { createModel } from 'xstate/lib/model';

/**
 * App Model
 * Contains all global state and events expose to the application
 *
 * experimenting with this, as trying to access nested actors is proving difficult
 * in theory this machine should defer to other actors, and is just responsible for marshalling events
 */
const appModel = createModel(
  {
    name: 'terry',
  },
  {
    events: {
      begin: (name: string) => ({ name }),
    },
  }
);

export default appModel;
