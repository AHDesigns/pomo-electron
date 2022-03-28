import { createModel } from 'xstate/lib/model';
import { UserConfig } from '@shared/types';
import { ContextFrom, EventFrom } from 'xstate';

const mainModel = createModel(
  {
    loaded: false,
  },
  {
    events: {
      CONFIG_LOADED: (data: UserConfig) => ({ data }),
    },
  }
);

export type MainContext = ContextFrom<typeof mainModel>;
export type MainEvents = EventFrom<typeof mainModel>;
export default mainModel;
