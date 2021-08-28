import styled from 'styled-components';

export const LineBreak = styled.div`
  width: 90%;
  border-bottom: thin solid ${({ theme: { palette } }) => palette.backgroundBright};
  margin: 0 auto 20px;
`;
