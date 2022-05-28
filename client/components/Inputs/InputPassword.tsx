import React from 'react';
import classNames from 'classnames';

export type IInputPassword = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'type'
> &
  Required<Pick<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'placeholder'>> & {
    hasError?: boolean;
    type?: 'password' | 'text';
    onChange(n: string): void;
  };

export const InputPassword = React.forwardRef<HTMLInputElement, IInputPassword>(
  ({ id, hasError, value, onChange, className, type = 'password', ...props }, ref) => (
    <input
      ref={ref}
      className={classNames(
        'w-full rounded border border-thmBackgroundProminent bg-thmBackgroundBright px-2 leading-8 outline-none',
        hasError ? 'text-thmRed' : 'text-thmWhiteBright',
        hasError ? 'ring-1 ring-thmRed focus:ring' : 'focus:ring focus:ring-thmBright',
        className
      )}
      id={id}
      type={type}
      {...(hasError && {
        'aria-describedby': `${id}-error`,
      })}
      value={value}
      onChange={({ target: { value: n } }) => {
        onChange(n);
      }}
      {...props}
    />
  )
);
