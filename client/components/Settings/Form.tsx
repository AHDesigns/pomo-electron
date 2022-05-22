import React, { useRef, useState } from 'react';
import { IChildren, Icons } from '@client/components';

const { EyeClosed, EyeOpen } = Icons;

// export const Form = styled.form`
//   display: grid;
//   grid-template-columns: [left] 35% [middle-l] 1fr [middle-r] 40% [right-l] 1fr [button] 15% [right];
//   gap: ${({ theme }) => theme.spacing.normal}px 0;
//   margin: 0 ${({ theme }) => theme.spacing.normal}px ${({ theme }) => theme.spacing.normal}px;
// `;

export function Form({ children }: IChildren): JSX.Element {
  return <form>{children}</form>;
}

export function Label({ children }: IChildren): JSX.Element {
  return <label>{children}</label>;
}
// export const Label = styled.label`
//   grid-column: left / middle-l;
//   text-align: left;
//   line-height: 2em;
// `;

interface IInputText {
  error?: boolean;
}

export function InputText({ children }: IChildren): JSX.Element {
  return <input>{children}</input>;
}

// export const InputText = styled.input<IInputText>`
//   grid-column: middle-r / right;
//   text-align: left;
//
//   color: ${({ theme }) => theme.palette.whiteBright};
//   background: ${({ theme }) => theme.palette.backgroundBright};
//   border: thin solid ${({ theme }) => theme.palette.backgroundProminent};
//
//   border-radius: 3px;
//   line-height: 2em;
//   padding-left: 5px;
//   width: 100%;
//
//   ${({ theme, error }) =>
//     error &&
//     `
//       outline: none;
//       box-shadow: 0 0 0 0.05em ${theme.palette.red}, 0 0 0 0.15em ${theme.palette.red};
//     `}
//
//   &:focus {
//     outline: none;
//     box-shadow: 0 0 0 0.05em
//         ${({ theme, error }) => (error ? theme.palette.red : theme.palette.background)},
//       0 0 0 0.15em ${({ theme, error }) => (error ? theme.palette.red : theme.palette.bright)};
//   }
// `;

export function ErrorMsg({ children }: IChildren): JSX.Element {
  return <p>{children}</p>;
}
// export const ErrorMsg = styled.p`
//   color: ${({ theme }) => theme.palette.red};
//   grid-column: left / right;
// `;

export function InputPwd({ children }: IChildren): JSX.Element {
  return <input type={'password'} />;
}
// const InputPwd = styled(InputText)`
//   grid-column: left / right-l;
// `;

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
