import { IChildren } from '@shared/types';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: Theme,
} as ComponentMeta<typeof Theme>;

const colors = [
  '--col-null',
  '--col-bg',
  '--col-bg-alt',
  '--col-base0',
  '--col-base1',
  '--col-base2',
  '--col-base3',
  '--col-base4',
  '--col-base5',
  '--col-base6',
  '--col-base7',
  '--col-base8',
  '--col-fg',
  '--col-fg-alt',
  '--col-grey',
  '--col-red',
  '--col-orange',
  '--col-green',
  '--col-teal',
  '--col-yellow',
  '--col-blue',
  '--col-dark-blue',
  '--col-magenta',
  '--col-violet',
  '--col-cyan',
  '--col-dark-cyan',
];

export function Palette(): JSX.Element {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-1">
      <p className="pl-3">var</p>
      <p className="pl-3">bg</p>
      {colors.map((c) => (
        <Color col={c} key={c}>
          {c}
        </Color>
      ))}
    </div>
  );
}

const palette = [
  '--color-background',
  '--color-backgroundProminent',
  '--color-backgroundBright',
  '--color-backgroundBrightest',
  '--color-accent',
  '--color-white',
  '--color-whiteBright',
  '--color-whiteBrightest',
  '--color-primary',
  '--color-bright',
  '--color-secondary',
  '--color-tertiary',
  '--color-red',
  '--color-orange',
  '--color-yellow',
  '--color-green',
  '--color-magenta',
];

export function Theme(): JSX.Element {
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-2 gap-1">
      <p className="pl-3">var</p>
      <p className="pl-3">bg</p>
      {palette.map((c) => (
        <Color col={c} key={c}>
          {c}
        </Color>
      ))}
    </div>
  );
}

function Color({ col, children }: IChildren & { col: string }): JSX.Element {
  return (
    <>
      <p
        className="pl-3"
        style={{
          color: `rgb(var(${col}))`,
          border: `thin solid rgb(var(${col}))`,
        }}
      >
        {col}
      </p>
      <p
        className="pl-3"
        style={{
          backgroundColor: `rgb(var(${col}))`,
          color: 'reset',
        }}
      >
        {children}
      </p>
    </>
  );
}
