import React, { useRef } from 'react';
import T from '@client/copy';
import { useTimerSettings } from '@client/hooks';
import { Button } from '@client/components';
import { useTheme } from 'styled-components';
import { timerSettingsModel } from '@client/machines';
import { ButtonPair, ErrorMsg, Form, InputText, Label } from './Form';
import { Setting } from './Setting';

const { CANCEL, SAVE, UPDATE } = timerSettingsModel.events;

export function Timer(): JSX.Element {
  const [state, send] = useTimerSettings();
  const {
    context: { long, pomo, short },
  } = state;
  const { spacing } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Setting variant="simple" heading="Timer" styles={{ marginTop: spacing.small }}>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          send(SAVE());
          inputRef.current?.focus();
        }}
      >
        <Label htmlFor="pomo">Pomodoro</Label>
        <InputText
          ref={inputRef}
          id="pomo"
          type="number"
          error={Boolean(pomo.error)}
          min={1}
          max={120}
          value={pomo.value}
          onChange={(e) => {
            send(UPDATE('pomo', Number(e.target.value)));
          }}
        />
        {pomo.error && <ErrorMsg>{pomo.error}</ErrorMsg>}
        <Label htmlFor="short-break">Short break</Label>
        <InputText
          name="short-break"
          id="short-break"
          error={Boolean(short.error)}
          type="number"
          min={1}
          max={120}
          value={short.value}
          onChange={({ target: { value } }) => {
            send(UPDATE('short', Number(value)));
          }}
        />
        {short.error && <ErrorMsg>{short.error}</ErrorMsg>}
        <Label htmlFor="long-break">Long break</Label>
        <InputText
          name="long-break"
          id="long-break"
          type="number"
          error={Boolean(long.error)}
          min={1}
          max={120}
          placeholder="xocx-..."
          value={long.value}
          onChange={({ target: { value } }) => {
            send(UPDATE('long', Number(value)));
          }}
        />
        {long.error && <ErrorMsg>{long.error}</ErrorMsg>}
        <ButtonPair
          Confirm={
            <Button
              disabled={!state.can('SAVE')}
              type="submit"
              style={{ gridColumn: 'middle-r / right' }}
            >
              {T.settings.submit}
            </Button>
          }
          Cancel={
            <Button
              disabled={!state.can('CANCEL')}
              type="button"
              variant="secondary"
              style={{ gridColumn: 'middle-r / right' }}
              onClick={() => {
                send(CANCEL());
                inputRef.current?.focus();
              }}
            >
              {T.settings.cancel}
            </Button>
          }
        />
      </Form>
    </Setting>
  );
}
