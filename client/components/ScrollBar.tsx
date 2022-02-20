import React, { useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { testWrap } from './testWrap/testComp';

const ScrollbarStyle = createGlobalStyle`
  /* width */
  ::-webkit-scrollbar {
    width: 8px;
    transition: all 0.2s;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.palette.background};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.palette.backgroundBright};
    border-radius: 4px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.palette.backgroundBrightest};
  }
`;

function ScrollBarC(): JSX.Element {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    /**
     * Detect if Mac user is using 'always show' scroll bars option
     * https://stackoverflow.com/a/55009770/1317h585
     * */
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode?.removeChild(outer);

    if (widthNoScroll - widthWithScroll !== 0) {
      setShowScroll(true);
    }
  }, []);

  return <>{showScroll && <ScrollbarStyle />}</>;
}

export const ScrollBar = testWrap(ScrollBarC, 'scroll-bar');
