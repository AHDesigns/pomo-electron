import { colors, palette, useTheme } from '@client/hooks';
import { IChildren } from '@shared/types';
import { ComponentMeta } from '@storybook/react';
import React from 'react';

export default {
  component: Theme,
} as ComponentMeta<typeof Theme>;

export function Palette(): JSX.Element {
  const [theme] = useTheme();

  return (
    <div>
      <p>Current Theme: {theme}</p>
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-1">
        <p className="pl-3">var</p>
        <p className="pl-3">bg</p>
        {colors.map((c) => (
          <Color col={c} key={c}>
            {c}
          </Color>
        ))}
      </div>
    </div>
  );
}

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
