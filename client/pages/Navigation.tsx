import { Pages } from '@client/machines/page/machine';
import React from 'react';
import { Button } from '@client/components';

interface INavigation {
  page: Pages;
  onNavigate(page: Pages): void;
}
export function Navigation({ onNavigate, page }: INavigation): JSX.Element {
  return (
    // <div className="absolute top-0 h-full w-full backdrop-blur-md">
    <div className="h-full w-full grow backdrop-blur-md">
      <ul className="mx-auto mt-3 flex w-fit flex-col justify-center space-y-4 align-middle">
        <NavItem onNavigate={onNavigate} page={page} name="Timer" />
        <NavItem onNavigate={onNavigate} page={page} name="Slack Settings" />
        <NavItem onNavigate={onNavigate} page={page} name="Timer Settings" />
        <NavItem onNavigate={onNavigate} page={page} name="Theme Settings" />
      </ul>
    </div>
  );
}

function NavItem({ onNavigate, page, name }: INavigation & { name: Pages }): JSX.Element | null {
  return page === name ? null : (
    <li>
      <Button
        onClick={() => {
          onNavigate(name);
        }}
        variant="tertiary"
      >
        {name}
      </Button>
    </li>
  );
}
