/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { Box } from '@client/components';
import { Header } from '@client/components/Header/Header';
import { Navigation } from '@client/pages/Navigation';
import { Timer } from '@client/components/Settings/Timer';
import { Slack } from '@client/components/Settings/Slack';
import { useTimerSettings } from '@client/hooks';
import { Pomodoro } from '@client/pages/Pomodoro';

// const Header = styled.div`
//   grid-template-columns: [left] 20% [middle] 60% [right] 20%;
// `;

export type Pages = 'Slack Settings' | 'Theme Settings' | 'Timer Settings' | 'Timer';

export interface IPageManager {
  initialPage?: Pages;
}

export function PageManager({ initialPage = 'Timer' }: IPageManager = {}): JSX.Element {
  const [navVisible, setNavVisible] = useState(false);
  const [page, navigatePageTo] = useState<Pages>(initialPage);
  const timerActor = useTimerSettings();

  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll bg-thmBackground text-base text-thmWhite">
      <h1 style={{ display: 'none' }}>Pomodoro App</h1>
      <Header
        onClick={() => {
          setNavVisible(!navVisible);
        }}
        showClose={navVisible}
        page={page}
      />
      {navVisible ? (
        <Navigation
          page={page}
          onNavigate={(p) => {
            setNavVisible(false);
            navigatePageTo(p);
          }}
        />
      ) : (
        <Box className="flex-grow">
          {page === 'Timer' ? (
            <Pomodoro />
          ) : page === 'Timer Settings' ? (
            timerActor ? (
              <Timer actor={timerActor} />
            ) : (
              <p>'loading'</p>
            )
          ) : page === 'Slack Settings' ? (
            <Slack />
          ) : (
            <p>ahh!</p>
          )}
        </Box>
      )}
    </div>
  );
}
