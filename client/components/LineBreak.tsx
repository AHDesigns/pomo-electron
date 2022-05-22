import React from 'react';
import { IChildren } from '@shared/types';

export function LineBreak({ children }: IChildren): JSX.Element {
  return (
    <div className="w-9/10 border-b border-thmBackgroundBright mt-0 mx-auto mb-2">{children}</div>
  );
}
