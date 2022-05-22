import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PageWrapper } from '@client/storybook';
import React from 'react';
import { Button, IButton } from './Button';

export default {
  component: Button,
} as ComponentMeta<typeof Button>;

// interface IStory extends IButton {};

const Template: ComponentStory<typeof Button> = (args) => (
  <PageWrapper>
    <Button {...args}>{args.children}</Button>
  </PageWrapper>
);

// export const Primary = Template.bind({});

export const Primary = {
  children: 'hello',
};

// Primary.args = {
//   children: 'hello',
// };

// export function PrimaryButton(): JSX.Element {
//   return (
//     <PageWrapper>
//       <Button>Some button text</Button>
//     </PageWrapper>
//   );
// }
