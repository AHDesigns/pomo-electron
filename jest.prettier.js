const { commonIgnore } = require('./tooling/commonIgnore');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'jest-runner-prettier',
  modulePathIgnorePatterns: commonIgnore.concat('e2e'),
};
