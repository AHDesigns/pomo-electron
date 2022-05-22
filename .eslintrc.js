const { commonIgnore } = require('./tooling/commonIgnore');

module.exports = {
  root: true,
  env: {
    // these are overridden on a per glob setup below
    browser: false,
    node: false,
    jest: false,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  extends: ['airbnb', 'airbnb-typescript', 'airbnb/hooks'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'error',
    'react/prop-types': 'off',
    'import/prefer-default-export': 'off',
    'spaced-comment': ['error', 'always', { exceptions: ['-'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: commonIgnore.concat(['**/*.typegen.ts']),
  overrides: [
    {
      files: ['*.js'],
      extends: [
        // keep this last
        'prettier',
      ],
      rules: {
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // keep this last
        'prettier',
      ],
      rules: {
        'no-underscore-dangle': 'off',
        'no-void': 'off',
        'react/destructuring-assignment': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-unused-params': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
          },
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'error',
        // unlikely to be a problem as I avoid `this`
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'never',
          },
        ],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            overrides: {
              constructors: 'no-public',
            },
          },
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/no-confusing-non-null-assertion': 'error',
        '@typescript-eslint/no-extra-non-null-assertion': 'error',
        '@typescript-eslint/no-implicit-any-catch': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/non-nullable-type-assertion-style': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/prefer-readonly': 'error',
        // '@typescript-eslint/prefer-readonly-parameter-types': 'error', // nice rule but issue around FB children, fix later
        '@typescript-eslint/prefer-ts-expect-error': 'error',
        '@typescript-eslint/promise-function-async': 'error',
        '@typescript-eslint/sort-type-union-intersection-members': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',
      },
    },
    {
      files: ['tooling/**', '.eslintrc.js', 'jest.config.js', 'jest.prettier.js'],
      env: {
        node: true,
      },
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
      },
    },
    {
      // envs don't seem to work since adding airbnb-typescript but keeping them
      // anyway in the event the issue is fixed, or I work out what I've done wrong
      // I suspect I'm expected to use typescript to check globals
      files: ['electron/**', '**/*.backstop.js', "./tailwind.config.js"],
      env: {
        node: true,
      },
    },
    {
      files: ['client/**'],
      env: {
        browser: true,
      },
      rules: {
        // we all know what we're doing here
        'react/no-array-index-key': 'off',
        // things like "don't" need the apostrophe escaped
        'react/no-unescaped-entities': 'off',
        'jsx-a11y/label-has-associated-control': [
          2,
          {
            labelAttributes: ['label'],
          },
        ],
      },
    },
    {
      files: ['shared/**'],
      env: {
        'shared-node-browser': true,
      },
    },
    {
      // Machine only rules
      files: ['client/machines/**'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
    {
      files: ['*.spec.@(js|jsx|ts|tsx)', 'e2e/**', 'testHelpers/**'],
      plugins: ['testing-library', 'jest-dom'],
      extends: ['plugin:testing-library/react', 'plugin:jest-dom/recommended'],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        // '@typescript-eslint/no-unsafe-call': 'off',
        // very common to create simple promise returns, and this saves on boilerplate
        '@typescript-eslint/require-await': 'off',
        // often helpful to force errors
        '@typescript-eslint/consistent-type-assertions': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        // for simple test utils this is often overkill and makes test updates slow
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
    {
      files: ['*.stories.@(js|jsx|ts|tsx)'],
      extends: ['plugin:storybook/recommended', 'plugin:storybook/csf-strict'],
      rules: {
        '@typescript-eslint/consistent-type-assertions': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
