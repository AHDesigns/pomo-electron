import styled from 'styled-components';

export const Form = styled.form`
  display: grid;
  grid-template-columns: [left] 35% [middle-l] 1fr [middle-r] 60% [right];
  gap: ${({ theme }) => theme.spacing.normal}px 0;
  margin: 0 ${({ theme }) => theme.spacing.normal}px ${({ theme }) => theme.spacing.normal}px;
`;
export const Label = styled.label`
  grid-column: left / middle-l;
  text-align: right;
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
