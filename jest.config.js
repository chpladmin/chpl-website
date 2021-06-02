module.exports = {
  collectCoverage: true,
  coverageDirectory: 'test_reports/unit/coverage/jsx',
  coverageReporters: ['html', 'lcov', 'text-summary'], // 'json'
  reporters: ['default', ['jest-junit', { outputDirectory: './test_reports/unit/jsx'}]],
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
};
