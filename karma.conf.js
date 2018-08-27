'use strict';

module.exports = (config) => {
    config.set({
        browsers: ['ChromeHeadless'],
        failOnEmptyTestSuite: false,
        files: [
            { pattern: 'src/app/specs.js' }
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'src/app/specs.js': ['webpack', 'sourcemap']
        },
        reporters: ['html', 'junit', 'super-dots', 'coverage-istanbul'], // use "spec" to print out tests to command line; turn off super-dots
        junitReporter: {
            outputDir: 'test_reports',
            suite: 'unit'
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
                ignore: 'grey'
            },
        },
        coverageIstanbulReporter: {
            dir: 'test_reports/coverage/',
            reports: ['html', 'lcov', 'text-summary'],
        },
        webpack: require('./webpack.config'),
    });
};
