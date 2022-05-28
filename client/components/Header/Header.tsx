import React from 'react';
import { Box, MenuButton, Pages } from '@client/components';
import pj from '../../../package.json';

export interface IHeader {
  onClick: () => void;
  page: Pages;
  showClose: boolean;
}

export function Header({ onClick, page, showClose }: IHeader): JSX.Element {
  return (
    <header className="grid h-11 grid-cols-[20%_60%_20%]">
      <MenuButton onClick={onClick} showClose={showClose} />
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
