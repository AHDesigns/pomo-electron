import { DefaultTheme } from 'styled-components';
import { IFont, Palette } from './styled';

const body: IFont = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  fontSize: '1rem',
  fontWeight: 400,
  lineHeight: 1.5,
  marginBottom: 2,
};

const nord: Palette = {
  background: '#2E3440',
  backgroundProminent: '#3B4252',
  backgroundBright: '#434C5E',
  backgroundBrightest: '#4C566A',
  accent: '#fff',
  white: '#D8DEE9',
  whiteBright: '#E5E9F0',
  whiteBrightest: '#ECEFF4',
  primary: '#8FBCBB',
  bright: '#88C0D0',
  secondary: '#81A1C1',
  tertiary: '#5E81AC',
  red: '#BF616A',
  orange: '#D08770',
  yellow: '#EBCB8B',
  green: '#A3BE8C',
  magenta: '#B48EAD',
};

export const theme: DefaultTheme = {
  shadows: [],
  theme: 'dark',
  palette: nord,
  special: {
    borderRadius: 3,
  },
  spacing: {
    xSmall: 4,
    small: 8,
    normal: 16,
    large: 32,
    Xlarge: 64,
  },
  typography: {
    body,
    caption: generateFontVariant({
      fontSize: '0.75rem',
      fontWeight: 400,
    }),
    h1: generateFontVariant({
      fontSize: '3.75rem',
      fontWeight: 300,
    }),
    h2: generateFontVariant({
      fontSize: '1.5rem',
      fontWeight: 700,
      marginBottom: 1.2,
    }),
    h3: generateFontVariant({
      fontWeight: 400,
      marginBottom: 1.8,
    }),
    h4: generateFontVariant(),
    h5: generateFontVariant({
      fontSize: '1.1em',
      fontWeight: 700,
    }),
  },
  zIndex: {
    background: -1,
    header: 1,
  },
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
function generateFontVariant(overrides = {} as Partial<IFont>): IFont {
  return {
    ...body,
    ...overrides,
  };
}
