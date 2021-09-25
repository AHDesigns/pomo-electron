import React, { FC } from 'react';
import { Timer } from './Timer';
import { Slack } from './Slack';

export const Settings: FC = () => (
  <>
    <Timer />
    <Slack />
  </>
);
