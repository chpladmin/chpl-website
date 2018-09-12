'use strict';
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = (config) => {
    config.set({
        browsers: config.ahrq ? ['ChromeHeadlessNoSandbox'] : ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
        },
        failOnEmptyTestSuite: false,
        files: [
            { pattern: 'src/app/specs.js' }
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'src/app/specs.js': ['webpack', 'sourcemap'],
        },
        reporters: config.useSpecReporter ? ['html', 'junit', 'spec', 'coverage-istanbul'] : ['html', 'junit', 'super-dots', 'coverage-istanbul'],
        junitReporter: {
            outputDir: 'test_reports',
            suite: 'unit',
        },
        htmlReporter: {
            groupSuites: true,
            outputFile: 'test_reports/units.html',
            useCompactStyle: true,
        },
        superDotsReporter: {
            nbDotsPerLine: 100,
            color: {
                success: 'green',
                failure: 'red',
                ignore: 'grey',
            },
        },
        coverageIstanbulReporter: {
            dir: 'test_reports/coverage/',
            reports: ['html', 'lcov', 'text-summary'],
        },
        webpack: require('./webpack.ci'),
    });
};
