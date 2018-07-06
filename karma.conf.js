'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var webpackConfig = require('./webpack.config');
webpackConfig.entry = {};
const webpackMerge = require('webpack-merge');
const webpackTestConfig = webpackMerge(webpackConfig({ test: true }), {
    entry: './src/app/index.js'
});

module.exports = function(config) {
    var configuration = {
        files: [
            './src/app/index.js',
            './src/app/**/*.spec.js',
        ],
        browserDisconnectTimeout: 60000,
        browserNoActivityTimeout: 60000,
        browserDisconnectTolerance: 10,
        preprocessors: {
            './src/app/index.js': ['webpack'],
            './src/app/**/*.spec.js': ['babel'],
        },
        logLevel: 'WARN',
        frameworks: ['phantomjs-shim', 'jasmine'],
        browsers : ['PhantomJS'],
        reporters: ['mocha', 'junit', 'html', 'super-dots'],
        webpack: webpackTestConfig,
        webpackMiddleware: {
            noInfo: true
        },
        proxies: {
            '/assets/': path.join('/base/', conf.paths.src, '/assets/')
        },
        coverageReporter: {
            dir: 'test_reports/coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        },
        htmlReporter: {
            groupSuites: true,
            outputFile: 'test_reports/units.html',
            useCompactStyle: true
        },
        junitReporter: {
            outputDir: 'test_reports',
            suite: 'unit'
        },
        mochaReporter: {
            //output: singleRun ? 'full' : 'minimal',
            output: 'minimal',
            divider: '',
            symbols: {
                success: '+',
                info: 'i',
                warning: '!',
                error: 'x'
            }
        },
        superDotsReporter: {
            nbDotsPerLine: 100,
            color: {
                success: 'green',
                failure: 'red',
                ignore: 'yellow'
            },
            icon: {
                success : '.',
                failure : 'x',
                ignore  : '?'
            }
        }
    };
    configuration.webpack.plugins = [];
    //console.log(configuration);
    config.set(configuration);
};


        /*plugins : [
            'karma-webpack',
            'karma-phantomjs-launcher',
            'karma-phantomjs-shim',
            'karma-coverage',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-growl-reporter',
            'karma-htmlfile-reporter',
            'karma-mocha-reporter',
            'karma-super-dots-reporter'
        ],*/
