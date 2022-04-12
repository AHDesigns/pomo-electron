import styled from 'styled-components';

export interface IButton {
  variant?: 'secondary' | 'tertiary';
}

export const Button = styled.button<IButton>`
  min-width: 80px;
  min-height: 20px;
  background: none;
  border-radius: 3px;
  cursor: pointer;
  padding: 10px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 0.05em ${({ theme }) => theme.palette.background},
      0 0 0 0.15em ${({ theme }) => theme.palette.bright};
  }
  border: none;
  ${({ theme, variant, disabled }) => {
    switch (variant) {
      case 'secondary':
        return disabled
          ? `
          color: ${theme.palette.background};
          background-color: ${theme.palette.backgroundProminent};
          cursor: not-allowed;
`
          : `
          color: ${theme.palette.white};
          background-color: ${theme.palette.backgroundBrightest};
`;
      case 'tertiary':
        return `
          color: ${theme.palette.bright};
          padding: 0;
          min-width: 0;
          text-decoration: underline;
`;
      default:
        return disabled
          ? `
          color: ${theme.palette.background};
          background-color: ${theme.palette.backgroundBright};
          cursor: not-allowed;
`
          : `
          color: ${theme.palette.background};
          background-color: ${theme.palette.bright};
        `;
    }
  }}
`;
