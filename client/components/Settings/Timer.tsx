import React from 'react';
import { useConfig } from '@client/hooks';
import { useTheme } from 'styled-components';
import { Setting } from './Setting';
import { Form, InputText, Label } from './Form';

export function Timer(): JSX.Element | null {
  const config = useConfig();
  const { spacing } = useTheme();

  if (config.loading) return null;
  const {
    storeUpdate,
    config: { timers },
  } = config;

  return (
    <Setting variant="simple" heading="Timer" styles={{ marginTop: spacing.small }}>
      <Form>
        <label htmlFor="pomo">
          Pomodoro
          <input
            id="pomo"
            // type="number"
            placeholder="xocx-..."
            value={timers.pomo}
            onChange={(e) => {
              console.log('called', e.target.value);
              storeUpdate({
                timers: {
                  pomo: Number(e.target.value),
                },
              });
            }}
          />
        </label>
        <Label htmlFor="short-break">Short break</Label>
        <InputText
          name="short-break"
          id="short-break"
          type="number"
          min={1}
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
          min={1}
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
}
