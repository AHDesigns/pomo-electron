import React, { FC } from 'react';
import { mocked } from 'ts-jest/utils';
import { renderNoProviders, screen } from '@test/rtl';
import * as _constants from '@shared/constants';
import { testWrap } from './testComp';

jest.mock('@shared/constants');

const constants = mocked(_constants);

describe('nullComp', () => {
  const RealComp: FC<{ text: string }> = ({ text }) => (
    <div data-testid="real-component">{text}</div>
  );

  beforeEach(() => {
    const Wrapped = testWrap(RealComp, 'test-component');
    renderNoProviders(<Wrapped text="some info" />);
  });

  describe('in tests', () => {
    beforeAll(() => {
      constants.isTest = true;
    });

    it('returns an empty span to assert on', () => {
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
      expect(screen.queryByText('some info')).not.toBeInTheDocument();
    });
  });

  describe('not in tests', () => {
    beforeAll(() => {
      constants.isTest = false;
    });

    it('returns the real component', () => {
      expect(screen.queryByTestId('real-component')).toBeInTheDocument();
      expect(screen.getByText('some info')).toBeInTheDocument();
    });
  });
});
