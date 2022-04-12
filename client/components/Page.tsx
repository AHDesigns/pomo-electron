import styled from 'styled-components';
import { Box } from '@client/components';

export const Page = styled(Box)`
  min-width: 100vw;
  min-height: 100vh;
  overflow: hidden;

  color: ${({ theme }) => theme.palette.white};
  background-color: ${({ theme }) => theme.palette.background};

  justify-content: stretch;
`;
