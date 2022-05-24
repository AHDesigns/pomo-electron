import React, { FC, useState } from 'react';
import { Pomodoro, Settings, Box, MenuButton } from '@client/components';
import pj from 'package.json';

// const Header = styled.div`
//   grid-template-columns: [left] 20% [middle] 60% [right] 20%;
// `;

export type Pages = 'Pomodoro' | 'Settings';

export interface IPageManager {
  initialPage?: Pages;
}

export function PageManager({ initialPage = 'Pomodoro' }: IPageManager = {}): JSX.Element {
  const [page, navigatePageTo] = useState<Pages>(initialPage);

  return (
    <div className="w-full h-full overflow-hidden text-thmWhite bg-thmBackground">
      <h1 style={{ display: 'none' }}>Pomodoro App</h1>
      <header className="grid grid-cols-[20%_60%_20%]">
        <MenuButton
          onClick={() => {
            navigatePageTo(page === 'Settings' ? 'Pomodoro' : 'Settings');
          }}
          showClose={page === 'Settings'}
        />
        <Box>
          <h2 style={{ textAlign: 'center' }}>{page === 'Settings' ? 'Settings' : 'Timer'}</h2>
        </Box>
        <Box>
          <p className="text-thmBackgroundBrightest">Beta</p>
          <p className="text-thmBackgroundBright">{pj.version}</p>
        </Box>
      </header>
      <Box classNames="flex-grow">
        {page === 'Settings' && <Settings />}
        {page === 'Pomodoro' && <Pomodoro />}
      </Box>
    </div>
  );
}
