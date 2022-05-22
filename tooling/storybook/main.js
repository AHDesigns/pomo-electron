module.exports = {
  stories: [
    '../../client/components/**/*.stories.@(js|jsx|ts|tsx)',
    '../../client/machines/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-actions',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          postcssOptions: {
            plugins: ['tailwindcss', 'autoprefixer'],
          },
          // eslint-disable-next-line global-require
          implementation: require('postcss'),
        },
      },
    },
  ],
};
