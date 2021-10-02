import { IBridge } from '@shared/types';
import React, { createContext, FC, useContext } from 'react';

const bridgeContext = createContext<IBridge>({} as IBridge);

const { Provider } = bridgeContext;

export const useBridge = (): IBridge => useContext(bridgeContext);

export const BridgeProvider: FC<{ bridge: IBridge }> = ({ bridge, children }) => {
  return <Provider value={bridge}>{children}</Provider>;
};
