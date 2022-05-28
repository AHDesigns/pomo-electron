import { PageWrapper } from '@client/storybook';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { IInputNumber, InputNumber as InputNumberC } from './InputNumber';
import { InputPassword } from './InputPassword';

export default {
  component: InputNumberC,
  args: {
    wrapped: true,
    hasError: false,
  },
} as ComponentMeta<StoryArgs>;

type StoryArgs = (
  args: IInputNumber & {
    wrapped: boolean;
  }
) => JSX.Element;

export const Inputs: ComponentStory<StoryArgs> = (args) => (
  <PageWrapper wrapped={args.wrapped} padded centered>
    <InputNumberC {...args} placeholder="add some number" />
    <InputNumberC {...args} placeholder="add some number" />
    <InputPassword
      {...args}
      id="input-password"
      placeholder="enter your password"
      onChange={() => {}}
    />
  </PageWrapper>
);

export const InputNumber: ComponentStory<StoryArgs> = (args) => (
  <PageWrapper wrapped={args.wrapped} padded centered>
    <InputNumberC {...args} placeholder="add some number" />
  </PageWrapper>
);

InputNumber.args = {};
