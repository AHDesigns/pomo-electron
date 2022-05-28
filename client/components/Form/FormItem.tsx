import React, { useRef, useState } from 'react';
import { InputNumber, IInputNumber } from '@client/components/Inputs/InputNumber';
import { IInputPassword, InputPassword } from '@client/components/Inputs/InputPassword';
import { EyeClosed, EyeOpen } from '@client/components/Icons';
import { IChildren } from '@shared/types';

interface IFormItemNumber extends IFormItem {
  input: Omit<IInputNumber, 'id'>;
}

export function FormItemNumber({ id, input, label }: IFormItemNumber): JSX.Element {
  return (
    <FormItem id={id} label={label}>
      <InputNumber {...input} id={id} />
    </FormItem>
  );
}

interface IFormItemPassword extends IFormItem {
  input: Omit<IInputPassword, 'id'>;
}

export function FormItemPassword({ id, input, label }: IFormItemPassword): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);

  return (
    <FormItem label={label} id={label}>
      <div className="flex gap-1">
        <div className="grow">
          <InputPassword {...input} ref={inputEl} id={id} type={isVisible ? 'text' : 'password'} />
        </div>
        <button
          type="button"
          onClick={() => {
            toggleVisibility();
          }}
          className="rounded border border-thmBackgroundProminent bg-thmBackgroundBright fill-thmBright px-1 text-thmWhiteBright outline-none focus:ring focus:ring-thmBright"
        >
          {isVisible ? (
            <EyeOpen color="bright" size="20px" />
          ) : (
            <EyeClosed color="bright" size="20px" />
          )}
        </button>
      </div>
    </FormItem>
  );

  function toggleVisibility(): void {
    setIsVisible(!isVisible);
    inputEl.current?.focus();
  }
}

interface IFormItem {
  id: string;
  label: string;
}

function FormItem({ id, label, children }: IChildren & IFormItem): JSX.Element {
  return (
    <div className="flex max-w-md flex-col">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}
