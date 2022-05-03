const { commonIgnore } = require('./tooling/commonIgnore');

module.exports = {
  preset: 'jest-runner-prettier',
  modulePathIgnorePatterns: commonIgnore.concat('e2e'),
};
