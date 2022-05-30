import React, { ChangeEventHandler, ReactNode } from 'react';
import { Box, Checkbox } from '@client/components';

interface ISettingCommon {
  heading: string;
  children: ReactNode;
  onSubmit(): void;
}

interface ISettingSimple extends ISettingCommon {
  variant: 'simple';
}

interface ISettingToggle extends ISettingCommon {
  variant: 'toggle';
  onToggle: ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}

type ISetting = ISettingSimple | ISettingToggle;

export function Setting({ children, heading, onSubmit, ...props }: ISetting): JSX.Element {
  return (
    <Box className="mb-8 mt-4">
      <div className="mb-2 bg-thmBackgroundProminent py-2 px-2">
        {props.variant === 'toggle' ? (
          <Checkbox initiallyChecked={props.checked} onChange={props.onToggle}>
            <h2 className="text-lg">{heading}</h2>
          </Checkbox>
        ) : (
          <h2 className="text-lg">{heading}</h2>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mx-2 flex flex-col gap-3"
      >
        {children}
      </form>
    </Box>
  );
}
