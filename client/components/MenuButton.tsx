import React, { MouseEventHandler } from 'react';
import { CssSize } from '@shared/types';
import { testWrap } from './testWrap/testComp';

interface IBar {
  width: CssSize;
}

// const Button = styled.button.attrs({
//   type: 'button',
// })`
//   border: none;
//   background: none;
//   padding: 10px;
//   overflow: hidden;
//   cursor: pointer;
//   outline: none;
// `;

const duration = 0.2;
const angle = 45;

const Bar = ({ width }: IBar): JSX.Element => <div className={`w-[${width}]`} />;
// const Bar = styled.div<IBar>`
//   position: absolute;
//   left: 0;
//
//   width: ${({ width }) => width};
//   height: 2px;
//   background-color: ${({ theme }) => theme.palette.white};
//   opacity: 1;
//   transform: rotate(0deg);
//   transition: all ${duration}s;
//
//   transform-origin: center;
//
//   ${Button}:hover & {
//     background-color: ${({ theme }) => theme.palette.primary};
//   }
//   ${Button}:focus & {
//     background-color: ${({ theme }) => theme.palette.primary};
//   }
//
//   ${Button}:hover &.showClose {
//     background-color: ${({ theme }) => theme.palette.yellow};
//   }
//   ${Button}:focus &.showClose {
//     background-color: ${({ theme }) => theme.palette.yellow};
//   }
//
//   &.top {
//     top: 0;
//   }
//
//   &.middle {
//     top: 6px;
//   }
//
//   &.bottom {
//     top: 12px;
//   }
//
//   ${Button}:hover &.middle {
//     left: 4px;
//   }
//
//   &.top.showClose {
//     transform: rotate(${angle}deg);
//     top: 6px;
//   }
//
//   &.middle.showClose {
//     left: 15px;
//     opacity: 0;
//   }
//
//   &.bottom.showClose {
//     top: 6px;
//     transform: rotate(-${angle}deg);
//   }
// `;

interface IHamburgerC {
  showClose: boolean;
}

function HamburgerC({ showClose }: IHamburgerC): JSX.Element {
  return (
    <div
      aria-hidden
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
}

const Hamburger = testWrap(HamburgerC, 'hamburger');

interface IMenuButton {
  onClick: MouseEventHandler<HTMLButtonElement>;
  showClose: boolean;
}

export function MenuButton({ onClick, showClose }: IMenuButton): JSX.Element {
  return (
    <button onClick={onClick}>
      <span className="sr-only">{showClose ? 'timer' : 'settings'}</span>
      <Hamburger showClose={showClose} />
    </button>
  );
}

function cls(classes: string, showClose: boolean): string {
  return showClose ? `${classes} showClose` : classes;
}
