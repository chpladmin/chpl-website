module.exports = {
  collectCoverage: true,
  coverageDirectory: 'test_reports/unit/coverage/jsx',
  coverageReporters: ['html', 'lcov', 'text-summary'], // 'json'
  moduleDirectories: ['src/app', 'node_modules'],
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './test_reports/unit/jsx'}],
  ],
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
};
