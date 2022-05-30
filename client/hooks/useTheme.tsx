import { assertUnreachable } from '@shared/asserts';
import { IChildren } from '@shared/types';
import React, { useContext, useEffect, useMemo, useState } from 'react';

export const themes = ['nord', 'nord-light', 'one-dark'] as const;
export type ThemeName = typeof themes[number];

function updateTheme(theme: ThemeName): void {
  const r = document.querySelector<HTMLElement>(':root')?.style;

  if (!r) throw new Error('could not get :root selector for styles');

  themeReset(r);

  switch (theme) {
    case 'nord-light':
      return nordLight(r);
    case 'nord':
      return nord(r);
    case 'one-dark':
      return oneDark(r);
    default:
      return assertUnreachable(theme);
  }
}

export function ThemeProvider({
  theme: _theme,
  children,
}: IChildren & { theme: ThemeName }): JSX.Element {
  const [theme, setTheme] = useState(_theme);
  const value: ThemeContext = useMemo(() => [theme, setTheme], [theme, setTheme]);

  useEffect(() => {
    updateTheme(theme);
  }, [theme]);

  return <themeContext.Provider value={value}>{children}</themeContext.Provider>;
}

type ThemeContext = [theme: ThemeName, setTheme: (theme: ThemeName) => void];

const themeContext = React.createContext<ThemeContext | null>(null);

export function useTheme(): ThemeContext {
  const themeC = useContext(themeContext);
  if (!themeC) throw new Error('please use ThemeProvider');
  return themeC;
}

function themeReset(r: CSSStyleDeclaration): void {
  /* main */
  r.setProperty('--col-bg', 'var(--col-null)');
  r.setProperty('--col-bg-alt', 'var(--col-null)');
  r.setProperty('--col-fg', 'var(--col-null)');
  r.setProperty('--col-fg-alt', 'var(--col-null)');

  /* base */
  r.setProperty('--col-base0', 'var(--col-null)');
  r.setProperty('--col-base1', 'var(--col-null)');
  r.setProperty('--col-base2', 'var(--col-null)');
  r.setProperty('--col-base3', 'var(--col-null)');
  r.setProperty('--col-base4', 'var(--col-null)');
  r.setProperty('--col-base5', 'var(--col-null)');
  r.setProperty('--col-base6', 'var(--col-null)');
  r.setProperty('--col-base7', 'var(--col-null)');
  r.setProperty('--col-base8', 'var(--col-null)');

  /* colours */
  r.setProperty('--col-grey', 'var(--col-null)');
  r.setProperty('--col-red', 'var(--col-null)');
  r.setProperty('--col-orange', 'var(--col-null)');
  r.setProperty('--col-green', 'var(--col-null)');
  r.setProperty('--col-teal', 'var(--col-null)');
  r.setProperty('--col-yellow', 'var(--col-null)');
  r.setProperty('--col-blue', 'var(--col-null)');
  r.setProperty('--col-dark-blue', 'var(--col-null)');
  r.setProperty('--col-magenta', 'var(--col-null)');
  r.setProperty('--col-violet', 'var(--col-null)');
  r.setProperty('--col-cyan', 'var(--col-null)');
  r.setProperty('--col-dark-cyan', 'var(--col-null)');
}

function nord(r: CSSStyleDeclaration): void {
  /* --------------------------------------------------------------------------
   * Palette
   * ------------------------------------------------------------------------ */
  r.setProperty('--col-bg', '46 52 64');
  r.setProperty('--col-bg-alt', '39 44 54');
  r.setProperty('--col-base0', '25 28 37');
  r.setProperty('--col-base1', '36 40 50');
  r.setProperty('--col-base2', '44 51 63');
  r.setProperty('--col-base3', '55 62 76');
  r.setProperty('--col-base4', '67 76 94');
  r.setProperty('--col-base5', '76 86 106');
  r.setProperty('--col-base6', '144 153 171');
  r.setProperty('--col-base7', '216 222 233');
  r.setProperty('--col-base8', '240 244 252');
  r.setProperty('--col-fg', '236 239 244');
  r.setProperty('--col-fg-alt', '229 233 240');
  r.setProperty('--col-red', '191 97 106');
  r.setProperty('--col-orange', '208 135 112');
  r.setProperty('--col-green', '163 190 140');
  r.setProperty('--col-teal', '143 188 187');
  r.setProperty('--col-yellow', '235 203 139');
  r.setProperty('--col-blue', '129 161 193');
  r.setProperty('--col-dark-blue', '94 129 172');
  r.setProperty('--col-magenta', '180 142 173');
  r.setProperty('--col-violet', '93 128 174');
  r.setProperty('--col-cyan', '136 192 208');
  r.setProperty('--col-dark-cyan', '80 118 129');
  r.setProperty('--col-grey', 'var(--col-base4)');

  /* --------------------------------------------------------------------------
   * Theme
   * ------------------------------------------------------------------------ */

  r.setProperty('--color-background', 'var(--col-bg)');
  r.setProperty('--color-backgroundProminent', 'var(--col-bg-alt)');
  r.setProperty('--color-backgroundBright', 'var(--col-base3)');
  r.setProperty('--color-backgroundBrightest', 'var(--col-base5)');
  r.setProperty('--color-accent', '255 255 255');
  r.setProperty('--color-white', 'var(--col-fg)');
  r.setProperty('--color-whiteBright', 'var(--col-fg-alt)');
  r.setProperty('--color-whiteBrightest', 'var(--col-base8)');
  r.setProperty('--color-primary', 'var(--col-blue)');
  r.setProperty('--color-bright', 'var(--col-cyan)');
  r.setProperty('--color-secondary', 'var(--col-teal)');
  r.setProperty('--color-tertiary', 'var(--col-dark-blue)');
  r.setProperty('--color-red', 'var(--col-red)');
  r.setProperty('--color-orange', 'var(--col-orange)');
  r.setProperty('--color-yellow', 'var(--col-yellow)');
  r.setProperty('--color-green', 'var(--col-green)');
  r.setProperty('--color-magenta', 'var(--col-magenta)');
}

function nordLight(r: CSSStyleDeclaration): void {
  /* --------------------------------------------------------------------------
   * Palette
   * ------------------------------------------------------------------------ */
  r.setProperty('--col-bg', '229 233 240');
  r.setProperty('--col-bg-alt', '216 222 233');
  r.setProperty('--col-base0', '240 244 252');
  r.setProperty('--col-base1', '227 234 245');
  r.setProperty('--col-base2', '216 222 233');
  r.setProperty('--col-base3', '194 208 231');
  r.setProperty('--col-base4', '184 197 219');
  r.setProperty('--col-base5', '174 186 207');
  r.setProperty('--col-base6', '161 172 192');
  r.setProperty('--col-base7', '96 114 140');
  r.setProperty('--col-base8', '72 81 99');
  r.setProperty('--col-fg', '59 66 82');
  r.setProperty('--col-fg-alt', '46 52 64');

  r.setProperty('--col-red', '191 97 106');
  r.setProperty('--col-orange', '208 135 112');
  r.setProperty('--col-green', '163 190 140');
  r.setProperty('--col-teal', '143 188 187');
  r.setProperty('--col-yellow', '235 203 139');
  r.setProperty('--col-blue', '129 161 193');
  r.setProperty('--col-dark-blue', '94 129 172');
  r.setProperty('--col-magenta', '180 142 173');
  r.setProperty('--col-violet', '93 128 174');
  r.setProperty('--col-cyan', '136 192 208');
  r.setProperty('--col-dark-cyan', '80 118 129');
  r.setProperty('--col-grey', 'var(--col-base4)');

  /* --------------------------------------------------------------------------
   * Theme
   * ------------------------------------------------------------------------ */

  r.setProperty('--color-background', 'var(--col-bg)');
  r.setProperty('--color-backgroundProminent', 'var(--col-bg-alt)');
  r.setProperty('--color-backgroundBright', 'var(--col-base3)');
  r.setProperty('--color-backgroundBrightest', 'var(--col-base5)');
  r.setProperty('--color-accent', '255 255 255');
  r.setProperty('--color-white', 'var(--col-fg)');
  r.setProperty('--color-whiteBright', 'var(--col-fg-alt)');
  r.setProperty('--color-whiteBrightest', 'var(--col-base8)');
  r.setProperty('--color-primary', 'var(--col-blue)');
  r.setProperty('--color-bright', 'var(--col-cyan)');
  r.setProperty('--color-secondary', 'var(--col-teal)');
  r.setProperty('--color-tertiary', 'var(--col-dark-blue)');
  r.setProperty('--color-red', 'var(--col-red)');
  r.setProperty('--color-orange', 'var(--col-orange)');
  r.setProperty('--color-yellow', 'var(--col-yellow)');
  r.setProperty('--color-green', 'var(--col-green)');
  r.setProperty('--color-magenta', 'var(--col-magenta)');
}

function oneDark(r: CSSStyleDeclaration): void {
  /* --------------------------------------------------------------------------
   * Palette
   * ------------------------------------------------------------------------ */
  r.setProperty('--col-grey', 'var(--col-base4)');

  r.setProperty('--col-bg', '40 44 52');
  r.setProperty('--col-fg', '187 194 207');
  r.setProperty('--col-bg-alt', '33 36 43');
  r.setProperty('--col-fg-alt', '91 98 104');
  r.setProperty('--col-base0', '27 34 41');
  r.setProperty('--col-base1', '28 31 36');
  r.setProperty('--col-base2', '32 35 40');
  r.setProperty('--col-base3', '35 39 46');
  r.setProperty('--col-base4', '63 68 74');
  r.setProperty('--col-base5', '91 98 104');
  r.setProperty('--col-base6', '115 121 126');
  r.setProperty('--col-base7', '156 160 164');
  r.setProperty('--col-base8', '223 223 223');
  r.setProperty('--col-red', '255 108 107');
  r.setProperty('--col-orange', '218 133 72');
  r.setProperty('--col-green', '152 190 101');
  r.setProperty('--col-teal', '77 181 189');
  r.setProperty('--col-yellow', '236 190 123');
  r.setProperty('--col-blue', '81 175 239');
  r.setProperty('--col-dark-blue', '34 87 160');
  r.setProperty('--col-magenta', '198 120 221');
  r.setProperty('--col-violet', '169 161 225');
  r.setProperty('--col-cyan', '70 217 255');
  r.setProperty('--col-dark-cyan', '86 153 175');

  /* --------------------------------------------------------------------------
   * Theme
   * ------------------------------------------------------------------------ */

  r.setProperty('--color-background', 'var(--col-bg)');
  r.setProperty('--color-backgroundProminent', 'var(--col-bg-alt)');
  r.setProperty('--color-backgroundBright', 'var(--col-base3)');
  r.setProperty('--color-backgroundBrightest', 'var(--col-base5)');
  r.setProperty('--color-accent', '255 255 255');
  r.setProperty('--color-white', 'var(--col-fg)');
  r.setProperty('--color-whiteBright', 'var(--col-fg-alt)');
  r.setProperty('--color-whiteBrightest', 'var(--col-base8)');
  r.setProperty('--color-primary', 'var(--col-violet)');
  r.setProperty('--color-bright', 'var(--col-magenta)');
  r.setProperty('--color-secondary', 'var(--col-teal)');
  r.setProperty('--color-tertiary', 'var(--col-dark-blue)');
  r.setProperty('--color-red', 'var(--col-red)');
  r.setProperty('--color-orange', 'var(--col-orange)');
  r.setProperty('--color-yellow', 'var(--col-yellow)');
  r.setProperty('--color-green', 'var(--col-green)');
  r.setProperty('--color-magenta', 'var(--col-magenta)');
}

export const colors = [
  '--col-null',
  '--col-bg',
  '--col-bg-alt',
  '--col-base0',
  '--col-base1',
  '--col-base2',
  '--col-base3',
  '--col-base4',
  '--col-base5',
  '--col-base6',
  '--col-base7',
  '--col-base8',
  '--col-fg',
  '--col-fg-alt',
  '--col-grey',
  '--col-red',
  '--col-orange',
  '--col-green',
  '--col-teal',
  '--col-yellow',
  '--col-blue',
  '--col-dark-blue',
  '--col-magenta',
  '--col-violet',
  '--col-cyan',
  '--col-dark-cyan',
] as const;

export const palette = [
  '--color-background',
  '--color-backgroundProminent',
  '--color-backgroundBright',
  '--color-backgroundBrightest',
  '--color-accent',
  '--color-white',
  '--color-whiteBright',
  '--color-whiteBrightest',
  '--color-primary',
  '--color-bright',
  '--color-secondary',
  '--color-tertiary',
  '--color-red',
  '--color-orange',
  '--color-yellow',
  '--color-green',
  '--color-magenta',
] as const;
