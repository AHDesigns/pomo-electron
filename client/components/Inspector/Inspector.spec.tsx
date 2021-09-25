import React, { FC, useState } from 'react';
import { inspect as _inspect } from '@xstate/inspect';
import { render, RenderResult, screen } from '@test/rtl';
import { mocked } from 'ts-jest/utils';
import * as _constants from '@shared/constants';
import TestIds from '@shared/testids';
import { Button } from '@client/components';
import { IInspector, Inspector } from './Inspector';

jest.mock('@shared/constants');
jest.mock('@xstate/inspect', () => ({
  inspect: jest.fn(),
}));

const inspect = mocked(_inspect);
const constants = mocked(_constants, true);

describe('Inspector', () => {
  const InspectorWrapper: FC<IInspector> = ({ toggleable }) => {
    const [isVisible, setIsVisible] = useState(true);
    return (
      <div>
        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
        <Button
          data-testid="test-button"
          type="button"
          onClick={() => {
            setIsVisible((v) => !v);
          }}
        />
        {isVisible ? <Inspector toggleable={toggleable} /> : null}
      </div>
    );
  };

  const renderW = (props?: IInspector): RenderResult =>
    render(<InspectorWrapper toggleable={props?.toggleable} />);

  beforeAll(() => {
    constants.isTest = true;
    inspect.mockReturnValue(undefined);
  });

  describe('when not in development', () => {
    beforeAll(() => {
      constants.isDev = false;
    });

    it('does not render the inspector', () => {
      renderW();
      const iframe = screen.queryByTitle('xstate');
      expect(iframe).not.toBeInTheDocument();
      expect(screen.getByTestId(TestIds.NULL_COMP)).toBeInTheDocument();
    });
  });

  describe('in development', () => {
    const disconnectSpy = jest.fn();
    let inspectorReturnsInstance = true;

    beforeAll(() => {
      constants.isDev = true;
      inspect.mockImplementation(() => {
        const el = document.getElementById('xstate');
        if (!el) {
          throw new Error('no xstate iframe');
        }
        return inspectorReturnsInstance
          ? undefined
          : {
              disconnect: disconnectSpy,
              send: () => {},
              subscribe: () => ({ unsubscribe: () => {} }),
            };
      });
    });

    it('creates an iframe with the data-xstate property for xstate visualiser to hook into', () => {
      renderW();
      const iframe = screen.getByTitle('xstate');
      expect(iframe).toHaveAttribute('data-xstate');
    });

    describe('when passed a toggleable prop', () => {
      it('calls the inspector after the iframe has mounted and only connects once', () => {
        const { rerender } = renderW({ toggleable: true });
        expect(inspect).toHaveBeenCalledTimes(1);

        rerender(<InspectorWrapper />);
        expect(inspect).toHaveBeenCalledTimes(1);
      });

      it('can have visibility toggled, which is initially hidden', () => {
        renderW({ toggleable: true });
        const iframe = screen.getByTitle('xstate');
        expect(iframe).toBeInTheDocument();

        screen.getByRole('button', { name: /.*show.*/i }).click();
        expect(iframe).toHaveStyle({ display: 'block' });

        screen.getByRole('button', { name: /.*hide.*/i }).click();
        expect(iframe).toHaveStyle({ display: 'none' });
      });
    });

    describe('when not passed a toggleable prop', () => {
      it('can not be toggled, and is always shown', () => {
        renderW();
        const iframe = screen.getByTitle('xstate');
        expect(iframe).toBeInTheDocument();

        expect(screen.queryByRole('button', { name: /.*show.*/i })).not.toBeInTheDocument();

        expect(iframe).toHaveStyle({ display: 'block' });
      });
    });

    describe('when the inspector does not return an instance', () => {
      beforeAll(() => {
        inspectorReturnsInstance = false;
      });

      it('disconnects from the inspector when no longer rendered', () => {
        renderW();
        screen.getByTestId('test-button').click();
        expect(inspect).toHaveBeenCalledTimes(1);
        expect(disconnectSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the inspector does return an instance', () => {
      beforeAll(() => {
        inspectorReturnsInstance = true;
      });

      it('does not try to disconnect', () => {
        renderW();
        screen.getByTestId('test-button').click();
        expect(inspect).toHaveBeenCalledTimes(1);
        expect(disconnectSpy).toHaveBeenCalledTimes(0);
      });
    });
  });
});
