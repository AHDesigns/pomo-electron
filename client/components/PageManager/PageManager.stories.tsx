import { PageWrapper } from '@client/storybook';
import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { IPageManager, PageManager as Pages } from './PageManager';

export default {
  component: Pages,
  args: {
    initialPage: 'Pomodoro',
    wrapped: true,
  },
} as ComponentMeta<StoryArgs>;

type StoryArgs = (
  args: IPageManager & {
    wrapped: boolean;
  }
) => JSX.Element;

export const PageManager: ComponentStory<StoryArgs> = (args) =>
  args.wrapped ? (
    <PageWrapper>
      <Pages initialPage={args.initialPage} />
    </PageWrapper>
  ) : (
    <Pages initialPage={args.initialPage} />
  );

PageManager.args = {
  initialPage: 'Pomodoro',
};
