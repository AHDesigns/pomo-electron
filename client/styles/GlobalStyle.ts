import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *,
  *:before,
  *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Lato, Helvetica, sans-serif;
    font-size: 16px;
    overflow-x: hidden;
  }

  li {
    text-decoration: none;
    list-style-type: none;
  }


  svg {
    max-height: 100%;
    max-width: 100%;
  }

  .sr-only {
    border: 0;
    clip: rect(0 0 0 0);
    clippath: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }
`;
