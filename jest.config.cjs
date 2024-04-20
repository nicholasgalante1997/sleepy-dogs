/** 
 * @type {import('ts-jest').JestConfigWithTsJest} 
 * @see https://stackoverflow.com/questions/73735202/typescript-jest-imports-with-js-extension-cause-error-cannot-find-module
 * */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageProvider: 'babel',
  coverageDirectory: 'coverage',
  coverageReporters: ['clover', 'json', 'json-summary', 'lcov', 'html', 'html-spa', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  transform: {
      '\\.[jt]sx?$': 'ts-jest'
  },
  globals: {
      'ts-jest': {
          useESM: true
      }
  },
  moduleNameMapper: {
      '(.+)\\.js': '$1'
  },
  extensionsToTreatAsEsm: ['.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.test.ts']
};