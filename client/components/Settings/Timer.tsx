import React, { FC } from 'react';
import { useConfig } from '@client/components/useConfig';
import { useTheme } from 'styled-components';
import { Setting } from '@client/components/Settings/Setting';
import { Form, InputText, Label } from '@client/components/Settings/Form';

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
          value={timers.shortBreak}
          onChange={({ target: { value } }) => {
            storeUpdate({
              timers: {
                shortBreak: Number(value),
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
          value={timers.longBreak}
          onChange={({ target: { value } }) => {
            storeUpdate({
              timers: {
                longBreak: Number(value),
              },
            });
          }}
        />
      </Form>
    </Setting>
  );
};
