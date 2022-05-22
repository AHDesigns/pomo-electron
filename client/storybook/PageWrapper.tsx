import React from 'react';

// const Wrapper = styled.div`
//   width: 300px;
//   height: 300px;
//   overflow-y: scroll;
//   margin: 20px auto;
//   border-radius: 13px;
//   box-shadow: 0 22px 70px 4px rgba(0, 0, 0, 0.56);
//   background: ${({ theme }) => theme.palette.background};
// `;

interface IPageWrapper {
  children: React.ReactNode;
}

export function PageWrapper({ children }: IPageWrapper): JSX.Element {
  return <div>{children}</div>;
}
