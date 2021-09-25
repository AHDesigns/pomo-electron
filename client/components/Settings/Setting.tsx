import React, { ChangeEventHandler, CSSProperties, ReactNode } from 'react';
import styled, { useTheme } from 'styled-components';
import { Box , Checkbox } from '@client/components';


interface ISettingCommon {
  heading: string;
  styles?: CSSProperties;
  children: ReactNode;
}

interface ISettingSimple extends ISettingCommon {
  variant: 'simple';
}

interface ISettingToggle extends ISettingCommon {
  variant: 'toggle';
  onToggle: ChangeEventHandler<HTMLInputElement>;
  checked: boolean;
}

type ISetting = ISettingSimple | ISettingToggle;

export function Setting({ children, heading, styles, ...props }: ISetting): JSX.Element {
  const theme = useTheme();
  return (
    <Box style={styles}>
      <div
        style={{
          padding: `${theme.spacing.small}px ${theme.spacing.normal}px`,
          marginBottom: `${theme.spacing.normal}px`,
          backgroundColor: theme.palette.backgroundProminent,
        }}
      >
        {props.variant === 'toggle' ? (
          <Checkbox checked={props.checked} onChange={props.onToggle}>
            <H2>{heading}</H2>
          </Checkbox>
        ) : (
          <H2>{heading}</H2>
        )}
      </div>
      {children}
    </Box>
  );
}

const H2 = styled.h2`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
`;
