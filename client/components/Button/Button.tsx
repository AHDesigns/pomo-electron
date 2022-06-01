/* eslint-disable react/button-has-type */
import { IChildren } from '@shared/types';
import classNames from 'classnames';
import React, { ButtonHTMLAttributes } from 'react';
import './button.css';

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
const colors =
  'transition transition-all hover:brightness-125 disabled:hover:brightness-100 disabled:cursor-not-allowed active:brightness-150';
const common = 'button w-fit p-2 px-4 shadow-3xl';

export function Button({
  children,
  variant,
  fullWidth,
  type = 'button',
  className,
  ...props
}: IButton & IChildren): JSX.Element {
  const width = fullWidth ? 'w-full' : 'w-fit';
  // eslint-disable-next-line no-nested-ternary
  return !variant || variant === 'primary' ? (
    <button
      type={type}
      className={classNames(
        colors,
        common,
        'bg-thmPrimary uppercase text-thmBackground focus:bg-thmBright disabled:bg-thmBackgroundBrightest disabled:text-thmBackground disabled:hover:brightness-100',
        width,
        className
      )}
      {...props}
    >
      {children}
    </button>
  ) : variant === 'secondary' ? (
    <button
      type={type}
      className={classNames(
        colors,
        common,
        // 'bg-thmBackgroundBrightest text-thmFgDim disabled:bg-thmBackgroundSubtle disabled:text-thmBackground',
        'border-2 uppercase text-thmPrimary disabled:border-thmBackgroundBrightest disabled:text-thmBackgroundBrightest ',
        width,
        className
      )}
      {...props}
    >
      {children}
    </button>
  ) : (
    <button
      type={type}
      className={classNames(
        colors,
        'rounded border-none p-0 text-thmSecondary underline underline-offset-1 shadow-none outline-none hover:underline-offset-2 focus:ring  focus:ring-thmBright disabled:border-thmBackgroundBrightest disabled:text-thmBackgroundBrightest',
        width,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
