import React from 'react';
import { PageWrapper } from '@client/storybook';
import { action } from '@storybook/addon-actions';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Slack as SlackC } from './Slack';

const meta: ComponentMeta<StoryArgs> = {
  component: SlackC,
  args: {
    wrapped: true,
  },
};
export default meta;

type StoryArgs = (args: { wrapped: boolean }) => JSX.Element;

export const Slack: ComponentStory<StoryArgs> = (args) => (
  <PageWrapper wrapped={args.wrapped}>
    <SlackC />
  </PageWrapper>
);
