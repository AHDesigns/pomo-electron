import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';
import { theme } from '../../client/styles/theme';

// const { white, background, accent } = theme.palette;
const myTheme = create({
  brandTitle: 'Pancake',
  brandUrl: 'https://github.com/AHDesigns/pancake-electron',
  brandImage: '/storybook-icon.png',
  base: 'dark',
  // colorPrimary: background,
  // colorSecondary: accent,
  // appBg: background,
  // appContentBg: background,
  // barBg: background,
  // textColor: white,
  fontBase: theme.typography.body.fontFamily,
});

addons.setConfig({
  theme: myTheme,
});
