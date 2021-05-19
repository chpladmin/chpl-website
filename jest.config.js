module.exports = {
  collectCoverage: true,
  coverageDirectory: 'test_reports/coverage/jsx',
  coverageReporters: ['html', 'lcov', 'text-summary'], // 'json'
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.[jt]sx?$',
};
