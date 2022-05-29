import React from 'react';
import { Box, MenuButton } from '@client/components';
import { Pages } from '@client/pages/PageManager';
import pj from '../../../package.json';

export interface IHeader {
  onClick: () => void;
  page: Pages;
  showClose: boolean;
}

export function Header({ onClick, page, showClose }: IHeader): JSX.Element {
  const title = page.includes('Settings') ? 'Settings' : page;
  return (
    <header className="grid h-11 flex-shrink-0 grid-cols-[20%_60%_20%]">
      <MenuButton onClick={onClick} showClose={showClose} />
      <Box>
        <h2 className="text-center text-lg">{showClose ? 'Settings' : title}</h2>
      </Box>
      <Box>
        <p className="text-sm text-thmBackgroundBrightest">Beta</p>
        <p className="text-xs text-thmBackgroundBright">{pj.version}</p>
      </Box>
    </header>
  );
}
