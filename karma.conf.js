'use strict';

module.exports = (config) => {
    config.set({
        browsers: [/*'PhantomJS',*/ 'ChromeHeadless'],
        failOnEmptyTestSuite: false,
        files: [
            { pattern: 'src/app/specs.js' }
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'src/app/specs.js': ['webpack']
        },
        reporters: [/*'spec', */'html', 'junit', 'super-dots'],
        junitReporter: {
            outputDir: 'test_reports',
            suite: 'unit'
        },
        htmlReporter: {
            groupSuites: true,
            outputFile: 'test_reports/units.html',
            useCompactStyle: true
        },
        superDotsReporter: {
            nbDotsPerLine: 100,
            color: {
                success: 'green',
                failure: 'red',
                ignore: 'yellow'
            },/*
            icon: {
                success : '.',
                failure : 'x',
                ignore  : '?'
            }*/
        },
        webpack: require('./webpack.config'),
    });
};
