import React, { FC } from 'react';
import { useConfig } from '@client/contexts';
import { useTheme } from 'styled-components';
import { Setting } from './Setting';
import { Form, InputText, Label } from './Form';

export const Timer: FC = () => {
  const {
    config: { timers },
    storeUpdate,
  } = useConfig();
  const { spacing } = useTheme();

  return (
    <Setting variant="simple" heading="Timer" styles={{ marginTop: spacing.small }}>
      <Form>
        <Label htmlFor="pomo">Pomodoro</Label>
        <InputText
          name="pomo"
          id="pomo"
          type="number"
          min={0}
          max={120}
          placeholder="xocx-..."
          value={timers.pomo}
          onChange={({ target: { value } }) => {
            storeUpdate({
              timers: {
                pomo: Number(value),
              },
            });
          }}
        />
        <Label htmlFor="short-break">Short break</Label>
        <InputText
          name="short-break"
          id="short-break"
          type="number"
          min={0}
          max={120}
          placeholder="xocx-..."
          value={timers.short}
          onChange={({ target: { value } }) => {
            storeUpdate({
              timers: {
                short: Number(value),
              },
            });
          }}
        />
        <Label htmlFor="long-break">Long break</Label>
        <InputText
          name="long-break"
          id="long-break"
          type="number"
          min={0}
          max={120}
          placeholder="xocx-..."
          value={timers.long}
          onChange={({ target: { value } }) => {
            storeUpdate({
              timers: {
                long: Number(value),
              },
            });
          }}
        />
      </Form>
    </Setting>
  );
};
