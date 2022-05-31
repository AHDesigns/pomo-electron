import classNames from 'classnames';
import React, { useState } from 'react';

export interface IInputSelect<A> {
  id: string;
  hasError?: boolean;
  readonly initialValue: A | 'none';
  className?: string;
  readonly options: readonly A[];
  onChange(n: A): void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export const InputSelectFactory = <A extends string>() =>
  React.forwardRef<HTMLSelectElement, IInputSelect<A>>(
    ({ id, hasError, initialValue, onChange, className, options }, ref) => {
      const [selected, setSelected] = useState(initialValue);
      return (
        <select
          ref={ref}
          className={classNames(
            'w-full rounded border border-thmBackgroundProminent bg-thmBackgroundBright p-2 outline-none',
            // eslint-disable-next-line no-nested-ternary
            hasError
              ? 'text-thmRed'
              : selected === 'none'
              ? 'text-thmBackgroundBrightest'
              : 'text-thmWhiteBright',
            hasError ? 'ring-1 ring-thmRed focus:ring' : 'focus:ring focus:ring-thmBright',
            className
          )}
          id={id}
          {...(hasError && {
            'aria-describedby': `${id}-error`,
          })}
          value={selected}
          onChange={({ target }) => {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const v = target.value as unknown as A;
            setSelected(v);
            onChange(v);
          }}
        >
          {initialValue === 'none' && (
            <option disabled value="none" className="hidden text-thmGreen">
              {' '}
              -- select an option --{' '}
            </option>
          )}
          {options.map((option) => (
            <option key={option} value={option} className="">
              {option}
            </option>
          ))}
        </select>
      );
    }
  );
