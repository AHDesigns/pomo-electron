import styled from 'styled-components';
import { testWrap } from './testWrap/testComp';

const BoxC = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

export const Box = testWrap(BoxC, 'box');
