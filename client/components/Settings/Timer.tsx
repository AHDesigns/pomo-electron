import React, { useRef } from 'react';
import T from '@client/copy';
import { useTimerSettings } from '@client/hooks';
import { Button } from '@client/components';
import { timerSettingsModel } from '@client/machines';
import { ButtonPair, ErrorMsg, InputText, Label, Setting } from './Components';
import { InputNumber } from '@client/components/Inputs/InputNumber';

const { CANCEL, SAVE, UPDATE } = timerSettingsModel.events;

export function Timer(): JSX.Element {
  const [state, send] = useTimerSettings();
  const {
    context: { long, pomo, short },
  } = state;
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Setting
      variant="simple"
      heading="Timer"
      onSubmit={() => {
        send(SAVE());
        inputRef.current?.focus();
      }}
    >
      <TimerInput
        name="Pomodoro"
        ariaLabel="Set the duration, in minutes, of a pomodoro timer"
        error={pomo.error}
        value={pomo.value}
        onChange={(n) => {
          send(UPDATE('pomo', n));
        }}
      />
      <TimerInput
        name="Short Break"
        ariaLabel="Set the duration, in minutes, of each short break timer between pomodoros"
        error={short.error}
        value={short.value}
        onChange={(n) => {
          send(UPDATE('short', n));
        }}
      />
      <TimerInput
        name="Long Break"
        ariaLabel="Set the duration, in minutes, of each long break timer which runs after completing several pomodoros"
        error={long.error}
        value={long.value}
        onChange={(n) => {
          send(UPDATE('long', n));
        }}
      />
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
    </Setting>
  );
}

interface ITimerInput {
  name: string;
  ariaLabel: string;
  error?: string;
  value: number;
  onChange: (n: number) => void;
}

function TimerInput({ name, onChange, value, error, ariaLabel }: ITimerInput): JSX.Element {
  const id = `timer-form-${name.toLowerCase().replace(/ /g, '-')}`;
  return (
    <>
      <label htmlFor={id} aria-label={ariaLabel}>
        {name}
      </label>
      <InputNumber
        id={id}
        hasError={Boolean(error)}
        min={1}
        max={120}
        value={value}
        onChange={(n) => {
          onChange(n);
        }}
      />
      {error && (
        <ErrorMsg id={`${id}-error`} aria-live="polite">
          {error}
        </ErrorMsg>
      )}
    </>
  );
}
