'use strict';
process.env.CHROME_BIN = require('puppeteer').executablePath()

let webpack = require('./webpack.config');

module.exports = config => {
    config.set({
        autoWatchBatchDelay: 3000,
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
            outputDir: 'test_reports/unit/js',
            suite: 'unit',
        },
        htmlReporter: {
            groupSuites: true,
            outputFile: 'test_reports/unit/units.html',
            useCompactStyle: true,
        },
        superDotsReporter: {
            nbDotsPerLine: 100,
            color: {
                success: 'green',
                failure: 'red',
                ignore: 'grey',
            },
            icon: config.ahrq ? {
                success : '.',
                failure : 'X',
                ignore  : 'i',
            } : {
                success : '✔',
                failure : '✖',
                ignore  : 'i',
            },
        },
        coverageIstanbulReporter: {
            dir: 'test_reports/unit/coverage/js',
            reports: ['html', 'lcov', 'text-summary'],
        },
        webpack: webpack({NODE_ENV: 'development'}),
    });
};
