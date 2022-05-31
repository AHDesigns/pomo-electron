import React, { useState } from 'react';
import { Button, FormItem, InputSelectFactory } from '@client/components';
import { type ThemeName, themes, useBridge, useTheme } from '@client/hooks';
import { Setting } from './Setting';

const InputSelect = InputSelectFactory<ThemeName>();

export function Theme(): JSX.Element {
  const [theme, setTheme] = useTheme();
  const id = 'theme-selector';
  const bridge = useBridge();
  const [selected, setSelected] = useState(theme);

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
      <p className="mt-4 text-sm">
        Can&apos;t find the theme you want?{' '}
        <Button
          variant="tertiary"
          onClick={() => {
            bridge.openExternal(
              'https://github.com/codethread/pomo-electron/issues/new?assignees=codethread&labels=theme&template=theme-request.md&title='
            );
          }}
        >
          Request it here
        </Button>{' '}
        and we'll get right on it!
      </p>
    </Setting>
  );
}
