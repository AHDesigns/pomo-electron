import React from 'react';
import T from '@client/copy';
import { useTimerSettings } from '@client/hooks';
import { Button } from '@client/components';
import { useTheme } from 'styled-components';
import timerSettingsModel from '@client/machines/timerSettings/model';
import { Form, InputText, Label } from './Form';
import { Setting } from './Setting';

const { CANCEL, SAVE, UPDATE } = timerSettingsModel.events;

export function Timer(): JSX.Element {
  const [state, send] = useTimerSettings();
  const { context: timers } = state;
  const { spacing } = useTheme();

  return (
    <Setting variant="simple" heading="Timer" styles={{ marginTop: spacing.small }}>
      <Form
        onSubmit={(e) => {
	  e.preventDefault();
          send(SAVE());
        }}
      >
        <Label htmlFor="pomo">Pomodoro</Label>
        <InputText
          id="pomo"
          type="number"
          min={1}
          max={120}
          value={timers.pomo}
          onChange={(e) => {
            send(UPDATE('pomo', Number(e.target.value)));
          }}
        />
        <Label htmlFor="short-break">Short break</Label>
        <InputText
          name="short-break"
          id="short-break"
          type="number"
          min={1}
          max={120}
          value={timers.short}
          onChange={({ target: { value } }) => {
            send(UPDATE('short', Number(value)));
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
            send(UPDATE('long', Number(value)));
          }}
        />
        <Button disabled={false} type="submit" style={{ gridColumn: 'middle-r / right' }}>
          {T.settings.submit}
        </Button>
        <Button disabled={false} type="button" variant="secondary" style={{ gridColumn: 'middle-r / right' }} onClick={() => {
	  send(CANCEL())
}}>
          Cancel
        </Button>
      </Form>
    </Setting>
  );
}
