import styled from 'styled-components';
import React, { ChangeEventHandler, CSSProperties } from 'react';
import { Box } from '@client/components';

/**
 * Hide checkbox visually but remain accessible to screen readers.
 * Source: https://polished.js.org/docs/#hidevisually
 */
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const Icon = styled.svg`
  float: left;
  fill: none;
  stroke: white;
  stroke-width: 2px;
`;

const StyledCheckbox = styled.div<{ checked: boolean }>`
  display: inline-block;
  float: left;
  width: 16px;
  height: 16px;
  background: ${({ theme, checked }) =>
    checked ? theme.palette.bright : theme.palette.backgroundBrightest};
  border-radius: 3px;
  transition: all 150ms;

  ${HiddenCheckbox}:focus + & {
    box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
      0 0 0 0.1em ${({ theme }) => theme.palette.bright};
  }

  ${Icon} {
    visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
  }
`;

const Label = styled.label`
  display: flex;
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  cursor: pointer;
  justify-content: space-between;
`;

interface ICheckbox {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  styles?: CSSProperties;
  children: React.ReactNode;
}

export function Checkbox({ checked, onChange, styles, children }: ICheckbox): JSX.Element {
  return (
    <Label style={styles}>
      {children}
      <Box>
        <HiddenCheckbox checked={checked} onChange={onChange} />
        <StyledCheckbox checked={checked}>
          <Icon viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </Icon>
        </StyledCheckbox>
      </Box>
    </Label>
  );
}
