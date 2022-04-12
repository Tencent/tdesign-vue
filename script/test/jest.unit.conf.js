const baseConfig = require('./jest.base.conf.js');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  testRegex: 'unit/.*\\.test\\.js$',
  // close coverage by default
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,vue}', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/src/_common'],
  coverageReporters: ['html', 'text-summary', 'cobertura'],
};
