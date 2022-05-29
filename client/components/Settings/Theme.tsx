import { FormItem } from '@client/components/Form/FormItem';
import { InputSelectFactory } from '@client/components/Inputs/InputSelect';
import { ThemeName, themes, useTheme } from '@client/hooks';
import React, { useRef } from 'react';
import { Setting } from './Setting';

const InputSelect = InputSelectFactory<ThemeName>();

export function Theme(): JSX.Element {
  const [theme, setTheme] = useTheme();
  const id = 'theme-selector';

  return (
    <Setting variant="simple" heading="Theme" onSubmit={() => {}}>
      <FormItem label="Set the current theme" id={id}>
        <InputSelect
          id={id}
          onChange={(t) => {
            setTheme(t);
          }}
          initialValue={theme}
          options={themes}
        />
      </FormItem>
    </Setting>
  );
}
