import { IChildren } from '@shared/types';
import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export interface IButton extends ButtonProps {
  variant?: 'secondary' | 'tertiary';
}

export function Button({ children, ...props }: IButton & IChildren): JSX.Element {
  return (
    <button className="border-2 text-thmRed  w-100 h-100" {...props}>
      hello
      {children}
    </button>
  );
}

// export const Button = styled.button<IButton>`
//   min-width: 80px;
//   min-height: 20px;
//   background: none;
//   border-radius: 3px;
//   cursor: pointer;
//   padding: 10px;
//   &:focus {
//     outline: none;
//     box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
//       0 0 0 0.15em ${({ theme }) => theme.palette.bright};
//   }
//   border: none;
//   ${({ theme, variant, disabled }) => {
//     switch (variant) {
//       case 'secondary':
//         return disabled
//           ? `
//           color: ${theme.palette.background};
//           background-color: ${theme.palette.backgroundProminent};
//           cursor: not-allowed;
// `
//           : `
//           color: ${theme.palette.white};
//           background-color: ${theme.palette.backgroundBrightest};
// `;
//       case 'tertiary':
//         return `
//           color: ${theme.palette.bright};
//           padding: 0;
//           min-width: 0;
//           text-decoration: underline;
// `;
//       default:
//         return disabled
//           ? `
//           color: ${theme.palette.background};
//           background-color: ${theme.palette.backgroundBright};
//           cursor: not-allowed;
// `
//           : `
//           color: ${theme.palette.background};
//           background-color: ${theme.palette.bright};
//         `;
//     }
//   }}
// `;
