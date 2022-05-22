module.exports = {
  content: ['./client/**/*.{ts,tsx}'],
  theme: {
    extend: {},
    colors: {
      thmBackground: withOpacityValue('--color-background'),
      thmBackgroundProminent: withOpacityValue('--color-backgroundProminent'),
      thmBackgroundBright: withOpacityValue('--color-backgroundBright'),
      thmBackgroundBrightest: withOpacityValue('--color-backgroundBrightest'),
      thmAccent: withOpacityValue('--color-accent'),
      thmWhite: withOpacityValue('--color-white'),
      thmWhiteBright: withOpacityValue('--color-whiteBright'),
      thmWhiteBrightest: withOpacityValue('--color-whiteBrightest'),
      thmPrimary: withOpacityValue('--color-primary'),
      thmBright: withOpacityValue('--color-bright'),
      thmSecondary: withOpacityValue('--color-secondary'),
      thmTertiary: withOpacityValue('--color-tertiary'),
      thmRed: withOpacityValue('--color-red'),
      thmOrange: withOpacityValue('--color-orange'),
      thmYellow: withOpacityValue('--color-yellow'),
      thmGreen: withOpacityValue('--color-green'),
      thmMagenta: withOpacityValue('--color-magenta'),
    },
  },
  plugins: [],
};

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}
