/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  coverageDirectory: './reports',
  clearMocks: true,
  setupFilesAfterEnv: ['./testHelpers/setupTests.ts', './testHelpers/jest.setup.ts'],
  modulePathIgnorePatterns: ['e2e', 'temp'],
  moduleNameMapper: {
    '^@shared(.*)$': '<rootDir>/shared/$1',
    '^@client(.*)$': '<rootDir>/client/$1',
    '^@electron(.*)$': '<rootDir>/electron/$1',
    '^@test/(.*)$': '<rootDir>/testHelpers/$1',
    'package.json': '<rootDir>/package.json',
  },
};
