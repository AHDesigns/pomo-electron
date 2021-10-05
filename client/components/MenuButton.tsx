import React, { FC, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { CssSize } from '@shared/types';
import { NullComp } from './NullComp/NullComp';

interface IBar {
  width: CssSize;
}

const Button = styled.button.attrs({
  type: 'button',
})`
  border: none;
  background: none;
  padding: 10px;
  overflow: hidden;
  cursor: pointer;
  outline: none;
`;

const duration = 0.2;
const angle = 45;

const Bar = styled.div<IBar>`
  position: absolute;
  left: 0;

  width: ${({ width }) => width};
  height: 2px;
  background-color: ${({ theme }) => theme.palette.white};
  opacity: 1;
  transform: rotate(0deg);
  transition: all ${duration}s;

  transform-origin: center;

  ${Button}:hover & {
    background-color: ${({ theme }) => theme.palette.primary};
  }
  ${Button}:focus & {
    background-color: ${({ theme }) => theme.palette.primary};
  }

  ${Button}:hover &.showClose {
    background-color: ${({ theme }) => theme.palette.yellow};
  }
  ${Button}:focus &.showClose {
    background-color: ${({ theme }) => theme.palette.yellow};
  }

  &.top {
    top: 0;
  }

  &.middle {
    top: 6px;
  }

  &.bottom {
    top: 12px;
  }

  ${Button}:hover &.middle {
    left: 4px;
  }

  &.top.showClose {
    transform: rotate(${angle}deg);
    top: 6px;
  }

  &.middle.showClose {
    left: 15px;
    opacity: 0;
  }

  &.bottom.showClose {
    top: 6px;
    transform: rotate(-${angle}deg);
  }
`;

const HamburgerC: FC<{ showClose: boolean }> = ({ showClose }) => (
  <div
    aria-hidden={true}
    style={{
      width: '35px',
      height: '16px',
      position: 'relative',
    }}
  >
    <Bar width="26px" className={cls('top', showClose)} />
    <Bar width="35px" className={cls('middle', showClose)} />
    <Bar width="26px" className={cls('bottom', showClose)} />
  </div>
);

const Hamburger = NullComp(HamburgerC, 'hamburger');

export const MenuButton: FC<{
  onClick: MouseEventHandler<HTMLButtonElement>;
  showClose: boolean;
}> = ({ onClick, showClose }) => (
  <Button onClick={onClick}>
    <span style={{ display: 'none' }}>menu</span>
    <Hamburger showClose={showClose} />
  </Button>
);

function cls(classes: string, showClose: boolean): string {
  return showClose ? `${classes} showClose` : classes;
}
