import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { EyeOpen, EyeClosed } from '@client/components/Icons';

export const Form = styled.form`
  display: grid;
  grid-template-columns: [left] 35% [middle-l] 1fr [middle-r] 40% [right-l] 1fr [button] 15% [right];
  gap: ${({ theme }) => theme.spacing.normal}px 0;
  margin: 0 ${({ theme }) => theme.spacing.normal}px ${({ theme }) => theme.spacing.normal}px;
`;

export const Label = styled.label`
  grid-column: left / middle-l;
  text-align: left;
  line-height: 2em;
`;

export const InputText = styled.input`
  grid-column: middle-r / right;
  text-align: left;

  color: ${({ theme }) => theme.palette.whiteBright};
  background: ${({ theme }) => theme.palette.backgroundBright};
  border: thin solid ${({ theme }) => theme.palette.backgroundProminent};
  border-radius: 3px;
  line-height: 2em;
  padding-left: 5px;
  width: 100%;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
      0 0 0 0.15em ${({ theme }) => theme.palette.bright};
  }
`;

const InputPwd = styled(InputText)`
  grid-column: left / right-l;
`;

const PwdToggle = styled.button`
  grid-column: button / right;
  color: ${({ theme }) => theme.palette.whiteBright};
  background: ${({ theme }) => theme.palette.backgroundBright};
  border: thin solid ${({ theme }) => theme.palette.backgroundProminent};
  border-radius: 3px;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
      0 0 0 0.15em ${({ theme }) => theme.palette.bright};
  }
`;

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
