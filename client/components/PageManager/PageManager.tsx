import React, { useState } from 'react';
import { Box, Pomodoro, Settings } from '@client/components';
import { Header } from '@client/components/Header/Header';

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
      <Header
        onClick={() => {
          navigatePageTo(page === 'Settings' ? 'Pomodoro' : 'Settings');
        }}
        page={page}
      />
      <Box classNames="flex-grow">
        {page === 'Settings' && <Settings />}
        {page === 'Pomodoro' && <Pomodoro />}
      </Box>
    </div>
  );
}
