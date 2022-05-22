import { PageWrapper } from '@client/storybook';
import React from 'react';
import { PageManager as Pages } from './PageManager';

export default {
  component: Pages,
};

export function PageManager(): JSX.Element {
  return (
    <PageWrapper>
      <Pages />
    </PageWrapper>
  );
}
