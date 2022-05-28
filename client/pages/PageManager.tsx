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

export type Pages = 'Pomodoro' | 'Slack' | 'Theme' | 'Timer';

export interface IPageManager {
  initialPage?: Pages;
}

export function PageManager({ initialPage = 'Pomodoro' }: IPageManager = {}): JSX.Element {
  const [navVisible, setNavVisible] = useState(false);
  const [page, navigatePageTo] = useState<Pages>(initialPage);
  const timerActor = useTimerSettings();

  return (
    <div className="h-full w-full overflow-y-scroll bg-thmBackground text-thmWhite">
      <h1 style={{ display: 'none' }}>Pomodoro App</h1>
      <Header
        onClick={() => {
          setNavVisible(!navVisible);
        }}
        showClose={navVisible}
        page={page}
      />
      <Box classNames="flex-grow">
        {page === 'Pomodoro' ? (
          <Pomodoro />
        ) : page === 'Timer' ? (
          timerActor ? (
            <Timer actor={timerActor} />
          ) : (
            <p>'loading'</p>
          )
        ) : page === 'Slack' ? (
          <Slack />
        ) : (
          <p>ahh!</p>
        )}
      </Box>
      {navVisible && (
        <Navigation
          onNavigate={(p) => {
            setNavVisible(false);
            navigatePageTo(p);
          }}
        />
      )}
    </div>
  );
}
