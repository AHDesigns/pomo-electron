import React, { ChangeEventHandler, CSSProperties } from 'react';
import { Box } from '@client/components';

/**
 * Hide checkbox visually but remain accessible to screen readers.
 * Source: https://polished.js.org/docs/#hidevisually
 */
// const HiddenCheckbox = styled.input``;

// const StyledCheckbox = styled.div<{ checked: boolean }>`
//   display: inline-block;
//   float: left;
//   width: 16px;
//   height: 16px;
//   background: ${({ theme, checked }) =>
//     checked ? theme.palette.bright : theme.palette.backgroundBrightest};
//   border-radius: 3px;
//   transition: all 150ms;
//
//   ${HiddenCheckbox}:focus + & {
//     box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
//       0 0 0 0.1em ${({ theme }) => theme.palette.bright};
//   }
//
//   ${Icon} {
//     visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
//   }
// `;

interface ICheckbox {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  styles?: CSSProperties;
  children: React.ReactNode;
}

export function Checkbox({ checked, onChange, styles, children }: ICheckbox): JSX.Element {
  return (
    <div style={styles} className="flex text-lg cursor-pointer justify-between">
      {children}
      <Box>
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div>
          <svg
            className="float-left stroke-thmWhite"
            fill="none"
            strokeWidth="2px"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </Box>
    </div>
  );
}
