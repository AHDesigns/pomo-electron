import React, { ChangeEventHandler, ReactNode, useRef, useState } from 'react';
import { Box, Checkbox, IChildren, Icons } from '@client/components';

const { EyeClosed, EyeOpen } = Icons;

export function Label({ children }: IChildren): JSX.Element {
  return <label>{children}</label>;
}
// export const Label = styled.label`
//   grid-column: left / middle-l;
//   text-align: left;
//   line-height: 2em;
// `;

export function ErrorMsg({
  children,
  ...props
}: IChildren & React.HTMLAttributes<HTMLParagraphElement>): JSX.Element {
  return (
    <p {...props} className="text-thmRed">
      {children}
    </p>
  );
}

export function InputPwd({ children }: IChildren): JSX.Element {
  return <input type={'password'} />;
}

export function PwdToggle({ children }: IChildren): JSX.Element {
  return <button>{children}</button>;
}
// const PwdToggle = styled.button`
//   grid-column: button / right;
//   color: ${({ theme }) => theme.palette.whiteBright};
//   background: ${({ theme }) => theme.palette.backgroundBright};
//   border: thin solid ${({ theme }) => theme.palette.backgroundProminent};
//   border-radius: 3px;
//
//   &:focus {
//     outline: none;
//     box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
//       0 0 0 0.15em ${({ theme }) => theme.palette.bright};
//   }
// `;

type IInputPassword = Required<
  Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    'id' | 'name' | 'onChange' | 'placeholder' | 'value'
  >
>;

export function InputPassword(props: IInputPassword): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const inputEl = useRef<HTMLInputElement>(null);

  return (
    <>
      <InputPwd {...props} ref={inputEl} type={isVisible ? 'text' : 'password'} />
      <PwdToggle type="button" onClick={toggleVisibility}>
        {isVisible ? (
          <EyeOpen color="bright" size="20px" />
        ) : (
          <EyeClosed color="bright" size="20px" />
        )}
      </PwdToggle>
    </>
  );

  function toggleVisibility(): void {
    setIsVisible(!isVisible);
    inputEl.current?.focus();
  }
}

interface IButtonPair {
  Confirm: React.ReactNode;
  Cancel: React.ReactNode;
}

export function ButtonPair({ Confirm, Cancel }: IButtonPair): JSX.Element {
  return (
    <div
      style={{
        gridColumn: 'left / right',
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <div className="mr-2">{Confirm}</div>
      {Cancel}
    </div>
  );
}

interface ISettingCommon {
  heading: string;
  children: ReactNode;
  onSubmit(): void;
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

export function Setting({ children, heading, onSubmit, ...props }: ISetting): JSX.Element {
  return (
    <Box classNames="">
      <div
        className="mb-2 bg-thmBackgroundProminent py-2 px-2"
        // style={{
        //   padding: `${theme.spacing.small}px ${theme.spacing.normal}px`,
        //   marginBottom: `${theme.spacing.normal}px`,
        //   backgroundColor: theme.palette.backgroundProminent,
        // }}
      >
        {props.variant === 'toggle' ? (
          <Checkbox checked={props.checked} onChange={props.onToggle}>
            <h2 className="text-2xl">{heading}</h2>
          </Checkbox>
        ) : (
          <h2 className="text-2xl">{heading}</h2>
        )}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="mx-2 flex flex-col"
      >
        {children}
      </form>
    </Box>
  );
}
