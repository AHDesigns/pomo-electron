/* eslint-disable react/button-has-type */
import { IChildren } from '@shared/types';
import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Required<Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>>;

export interface IButton extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
}

// const Common = () => (
//   <p className="rounded w-fit p-2 px-4 uppercase transition-colors hover:brightness-125 disabled:hover:brightness-100 disabled:cursor-not-allowed outline-0 focus:outline-1 focus:outline-offset-1 focus:outline-thmBright active:brightness-150 "></p>
// );
const common =
  'rounded w-fit p-2 px-4 uppercase transition-colors hover:brightness-125 disabled:hover:brightness-100 disabled:cursor-not-allowed outline-0 focus:outline-1 focus:outline-offset-1 focus:outline-thmBright active:brightness-150 shadow-3xl';

function not(arg?: boolean): boolean {
  return !arg;
}

export function Button({
  children,
  variant,
  fullWidth,
  ...props
}: IButton & IChildren): JSX.Element {
  const width = fullWidth ? 'w-full' : 'w-fit';
  // eslint-disable-next-line no-nested-ternary
  return !variant || variant === 'primary' ? (
    <button
      className={classNames(
        common,
        'bg-thmBright text-thmBackground  disabled:text-thmBackground disabled:bg-thmBackgroundBright disabled:cursor-not-allowed hover:brightness-125 disabled:hover:brightness-100',
        width
      )}
      {...props}
    >
      {children}
    </button>
  ) : variant === 'secondary' ? (
    <button
      className={classNames(
        common,
        'disabled:text-thmBackground disabled:bg-thmBackgroundProminent bg-thmBackgroundBrightest text-thmWhite',
        width
      )}
      {...props}
    >
      {children}
    </button>
  ) : (
    <button
      className={classNames(
        common,
        'text-thmBright border-2 disabled:border-thmBackgroundBrightest disabled:text-thmBackgroundBrightest ',
        width
      )}
      {...props}
    >
      {children}
    </button>
  );
}
