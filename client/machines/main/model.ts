import { createModel } from 'xstate/lib/model';
import { UserConfig } from '@shared/types';

const mainModel = createModel(
  {},
  {
    events: {
      CONFIG_LOADED: (data: UserConfig) => ({ data }),
    },
  }
);

export default mainModel;
