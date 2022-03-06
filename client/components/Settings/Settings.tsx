import React from 'react';
import { Timer } from './Timer';
import { Slack } from './Slack';

export function Settings(): JSX.Element {
  return (
    <>
      <Timer />
      <Slack />
    </>
  );
}
