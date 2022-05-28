import React from 'react';
import { Button } from '@client/components';
import { Pages } from './PageManager';

interface INavigation {
  onNavigate(page: Pages): void;
}
export function Navigation({ onNavigate }: INavigation): JSX.Element {
  return (
    <div className="absolute top-11 h-full w-full backdrop-blur-md">
      <ul className="mt-3 flex flex-col justify-center gap-3 text-center align-middle">
        <li>
          <Button
            onClick={() => {
              onNavigate('Slack');
            }}
            variant="tertiary"
          >
            Slack Settings
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              onNavigate('Timer');
            }}
            variant="tertiary"
          >
            Timer Settings
          </Button>
        </li>
        <li>
          <Button
            onClick={() => {
              onNavigate('Theme');
            }}
            variant="tertiary"
          >
            Theme
          </Button>
        </li>
      </ul>
    </div>
  );
}
