module.exports = {
  collectCoverage: true,
  coverageDirectory: 'test_reports/unit/coverage/jsx',
  coverageReporters: ['html', 'lcov', 'text-summary'], // 'json'
  moduleDirectories: ['src/app', 'node_modules'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/fileMock.js',
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './test_reports/unit/jsx'}],
  ],
  testEnvironment: 'jsdom',
  testRegex: '.*test.jsx$',
};
