import React from 'react';
import { IChildren } from '@shared/types';

interface IBox extends IChildren {
  classNames?: string;
  style?: React.CSSProperties;
}

export function Box({ children, classNames, style }: IBox): JSX.Element {
  return (
    <div
      style={style}
      className={` flex flex-col justify-center justify-items-stretch ${classNames ?? ''}`}
    >
      {children}
    </div>
  );
}
