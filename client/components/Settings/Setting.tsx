import React, { ChangeEventHandler, CSSProperties, ReactNode } from 'react';
import { Box, Checkbox, IChildren } from '@client/components';

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
  return (
    <Box style={styles}>
      <div
      // style={{
      //   padding: `${theme.spacing.small}px ${theme.spacing.normal}px`,
      //   marginBottom: `${theme.spacing.normal}px`,
      //   backgroundColor: theme.palette.backgroundProminent,
      // }}
      >
        {props.variant === 'toggle' ? (
          <Checkbox checked={props.checked} onChange={props.onToggle}>
            <h2>{heading}</h2>
          </Checkbox>
        ) : (
          <h2>{heading}</h2>
        )}
      </div>
      {children}
    </Box>
  );
}
