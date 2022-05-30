import classNames from 'classnames';
import React, { useState } from 'react';
import './checkbox.css';

interface ICheckbox {
  id: string;
  initiallyChecked: boolean;
  hasError?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onChange(checked: boolean): void;
}

export function Checkbox({
  initiallyChecked,
  hasError,
  children,
  onChange,
  disabled,
  id,
}: ICheckbox): JSX.Element {
  const [checked, setChecked] = useState(initiallyChecked);
  return (
    <label
      htmlFor={id}
      className={classNames('flex w-fit items-center space-x-2', {
        'text-thmBackgroundBrightest': disabled,
        'cursor-not-allowed': disabled,
        'text-thmRed': hasError,
      })}
    >
      {children}
      <input
        disabled={disabled}
        className="m-0 grid h-5 w-5 appearance-none place-content-center rounded bg-thmBackgroundBrightest outline-none transition-all focus:ring focus:ring-thmBright disabled:cursor-not-allowed disabled:bg-thmBackgroundProminent disabled:text-thmBackgroundBright"
        id={id}
        type="checkbox"
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          onChange(!checked);
        }}
      />
    </label>
  );
}
