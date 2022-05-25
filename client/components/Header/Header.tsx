import React from 'react';
import { Box, MenuButton, Pages } from '@client/components';
import pj from '../../../package.json';

export interface IHeader {
  onClick: () => void;
  page: Pages;
}

export function Header({ onClick, page }: IHeader): JSX.Element {
  return (
    <header className="grid grid-cols-[20%_60%_20%]">
      <MenuButton onClick={onClick} showClose={page === 'Settings'} />
      <Box>
        <h2 className="text-center text-2xl">{page === 'Settings' ? 'Settings' : 'Timer'}</h2>
      </Box>
      <Box>
        <p className="text-thmBackgroundBrightest">Beta</p>
        <p className="text-thmBackgroundBright">{pj.version}</p>
      </Box>
    </header>
  );
}
