import React from 'react';
import classNames from 'classnames';

export type IInputNumber = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> &
  Required<Pick<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'max' | 'min'>> & {
    hasError?: boolean;
    onChange(n: number): void;
  };

export function InputNumber({
  min,
  max,
  id,
  hasError,
  value,
  onChange,
  className,
  ...props
}: IInputNumber): JSX.Element {
  return (
    <input
      className={classNames(
        'rounded border border-thmBackgroundProminent bg-thmBackgroundBright px-2 leading-8 outline-none ',
        hasError ? 'text-thmRed' : 'text-thmWhiteBright',
        hasError ? 'ring-1 ring-thmRed focus:ring' : 'focus:ring focus:ring-thmBright',
        className
      )}
      id={id}
      type="number"
      {...(hasError && {
        'aria-describedby': `${id}-error`,
      })}
      min={1}
      max={120}
      value={value}
      onChange={({ target: { value: n } }) => {
        onChange(Number(n));
      }}
      {...props}
    />
  );
}
