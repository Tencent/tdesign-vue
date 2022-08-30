const baseConfig = require('./jest.base.conf.js');

module.exports = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{js,ts,tsx}'],
  // close coverage by default
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx,js,vue}', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/', '/src/_common'],
  coverageReporters: ['html', 'text-summary', 'cobertura'],
};
