import React, { useContext, useEffect } from 'react';
import { IChildren } from '@shared/types';

export type ThemeName = 'nord-light' | 'nord';

export function ThemeProvider({ theme, children }: IChildren & { theme: ThemeName }): JSX.Element {
  return <themeContext.Provider value={theme}>{children}</themeContext.Provider>;
}

const themeContext = React.createContext<ThemeName>('nord');

export function useTheme(themeOverride?: ThemeName): void {
  const themeC = useContext(themeContext);
  const theme = themeOverride ?? themeC;

  useEffect(() => {
    const r = document.querySelector<HTMLElement>(':root')?.style;
    if (!r) return;
    themeReset(r);
    if (theme === 'nord') {
      nord(r);
    } else if (theme === 'nord-light') {
      nordLight(r);
    }
  }, [theme]);
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
