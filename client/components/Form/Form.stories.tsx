import { PageWrapper } from '@client/storybook';
import React, { useState } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FormItemNumber as FormItemNumberC, FormItemPassword } from './FormItem';

export default {
  component: FormItemNumberC,
  args: {
    wrapped: true,
    hasError: false,
  },
} as ComponentMeta<StoryArgs>;

type StoryArgs = (args: { wrapped: boolean; hasError: boolean }) => JSX.Element;

export const Form: ComponentStory<StoryArgs> = ({ wrapped, hasError }) => {
  const [c, setC] = useState(0);
  const [s, setS] = useState('');

  return (
    <PageWrapper wrapped={wrapped} padded centered>
      <FormItemNumberC
        id="number item"
        label="Some number"
        input={{
          hasError,
          min: 0,
          max: 20,
          onChange(n) {
            setC(n);
          },
          value: c,
        }}
      />
      <FormItemNumberC
        id="number item"
        label="Some number"
        input={{
          hasError,
          min: 0,
          max: 20,
          onChange: setC,
          value: c,
        }}
      />
      <FormItemPassword
        id="ofijwef"
        label="input password"
        input={{
          hasError,
          placeholder: 'enter passowrd',
          onChange: setS,
          value: s,
        }}
      />
    </PageWrapper>
  );
};

export const FormInputPassword: ComponentStory<StoryArgs> = ({ wrapped, hasError }) => {
  const [s, setS] = useState('');

  return (
    <PageWrapper wrapped={wrapped} padded centered>
      <FormItemPassword
        id="ofijwef"
        label="input password"
        input={{
          hasError,
          placeholder: 'enter passowrd',
          onChange: setS,
          value: s,
        }}
      />
    </PageWrapper>
  );
};

export const FormInputNumber: ComponentStory<StoryArgs> = ({ wrapped, hasError }) => {
  const [c, setC] = useState(0);

  return (
    <PageWrapper wrapped={wrapped} padded centered>
      <FormItemNumberC
        id="number item"
        label="Some number"
        input={{
          hasError,
          min: 0,
          max: 20,
          onChange: setC,
          value: c,
        }}
      />
    </PageWrapper>
  );
};
