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
    if (theme === 'nord') {
      r.setProperty('--color-background', '46 52 64');
      r.setProperty('--color-backgroundProminent', '59 66 82');
      r.setProperty('--color-backgroundBright', '67 76 94');
      r.setProperty('--color-backgroundBrightest', '76 86 106');
      r.setProperty('--color-accent', '255 255 255');
      r.setProperty('--color-white', '216 222 233');
      r.setProperty('--color-whiteBright', '229 233 240');
      r.setProperty('--color-whiteBrightest', '236 239 244');
      r.setProperty('--color-primary', '143 188 187');
      r.setProperty('--color-bright', '136 192 208');
      r.setProperty('--color-secondary', '129 161 193');
      r.setProperty('--color-tertiary', '94 129 172');
      r.setProperty('--color-red', '191 97 106');
      r.setProperty('--color-orange', '208 135 112');
      r.setProperty('--color-yellow', '235 203 139');
      r.setProperty('--color-green', '163 190 140');
      r.setProperty('--color-magenta', '180 142 173');
    } else if (theme === 'nord-light') {
      r.setProperty('--color-white', '46 52 64');
      r.setProperty('--color-whiteBright', '59 66 82');
      r.setProperty('--color-whiteBrightest', '67 76 94');
      r.setProperty('--color-backgroundBrightest', '46 52 64');

      r.setProperty('--color-background', '216 222 233');
      r.setProperty('--color-backgroundProminent', '229 233 240');
      r.setProperty('--color-backgroundBright', '46 52 64');

      r.setProperty('--color-accent', '255 255 255');

      r.setProperty('--color-primary', '143 188 187');
      r.setProperty('--color-bright', '136 192 208');
      r.setProperty('--color-secondary', '129 161 193');
      r.setProperty('--color-tertiary', '94 129 172');
      r.setProperty('--color-red', '191 97 106');
      r.setProperty('--color-orange', '208 135 112');
      r.setProperty('--color-yellow', '235 203 139');
      r.setProperty('--color-green', '163 190 140');
      r.setProperty('--color-magenta', '180 142 173');
    }
  }, [theme]);
}
