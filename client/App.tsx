import React from 'react';

interface Hook {
  (): void;
}

export interface IApp {
  hooks?: {
    start: Hook;
    tick: Hook;
    pause: Hook;
    play: Hook;
    stop: Hook;
  };
}

export function App(props: IApp): JSX.Element {
  return <div>hello App!</div>;
}
