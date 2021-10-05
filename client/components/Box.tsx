import styled from 'styled-components';
import { NullComp } from './NullComp/NullComp';

const BoxC = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`;

export const Box = NullComp(BoxC, 'box');
