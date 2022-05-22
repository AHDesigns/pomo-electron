import React from 'react';
import { IChildren } from '@shared/types';

interface IBox extends IChildren {
  classNames?: string;
}

export function Box({ children, classNames }: IBox): JSX.Element {
  return (
    <div className={` flex flex-col justify-center justify-items-stretch ${classNames ?? ''}`}>
      {children}
    </div>
  );
}
