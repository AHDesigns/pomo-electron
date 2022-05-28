/* eslint-disable react/button-has-type */
import { IChildren } from '@shared/types';
import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Partial<Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>>;
// Required<Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>>;

export interface IButton extends ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
}

// const Common = () => (
//   <p className="rounded w-fit p-2 px-4 uppercase transition-colors hover:brightness-125 disabled:hover:brightness-100 disabled:cursor-not-allowed outline-0 focus:outline-1 focus:outline-offset-1 focus:outline-thmBright active:brightness-150 "></p>
// );
const common =
  'rounded w-fit p-2 px-4 uppercase transition-colors hover:brightness-125 disabled:hover:brightness-100 disabled:cursor-not-allowed outline-0 focus:outline-1 focus:outline-offset-1 focus:outline-thmBright active:brightness-150 shadow-3xl';

export function Button({
  children,
  variant,
  fullWidth,
  type = 'button',
  ...props
}: IButton & IChildren): JSX.Element {
  const width = fullWidth ? 'w-full' : 'w-fit';
  // eslint-disable-next-line no-nested-ternary
  return !variant || variant === 'primary' ? (
    <button
      type={type}
      className={classNames(
        common,
        'bg-thmBright text-thmBackground  hover:brightness-125 disabled:cursor-not-allowed disabled:bg-thmBackgroundBright disabled:text-thmBackground disabled:hover:brightness-100',
        width
      )}
      {...props}
    >
      {children}
    </button>
  ) : variant === 'secondary' ? (
    <button
      type={type}
      className={classNames(
        common,
        'bg-thmBackgroundBrightest text-thmWhite disabled:bg-thmBackgroundProminent disabled:text-thmBackground',
        width
      )}
      {...props}
    >
      {children}
    </button>
  ) : (
    <button
      type={type}
      className={classNames(
        common,
        'border-2 text-thmBright disabled:border-thmBackgroundBrightest disabled:text-thmBackgroundBrightest ',
        width
      )}
      {...props}
    >
      {children}
    </button>
  );
}
