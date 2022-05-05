import React from 'react';
import { useConfig } from '@client/hooks';
import { Timer } from './Timer';
import { Slack } from './Slack';

export function Settings(): JSX.Element | null {
  const config = useConfig();

  if (config.loading) return null;

  return (
    <>
      <Timer />
      <Slack />
    </>
  );
}
