'use strict';
var webpack = require('webpack');
var path = require('path');
var conf = require('./gulp/conf');

const webpackConfig = require('./webpack.test');

//process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    var configuration = {
        basePath: '',
        files: [
            'src/app/specs.js',
        ],
        frameworks: ['mocha'],
        failOnEmptyTestSuite: false,
        //logLevel: config.LOG_DEBUG,
        preprocessors: {
            'src/app/specs.js': ['webpack', 'sourcemap'],
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            dir: 'test_reports/coverage/',
            reporters: [
                { type: 'html' },
                { type: 'text' },
                { type: 'text-summary' },
            ],
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true,
            stats: 'minimal',
        },
        plugins: [
            require('istanbul-instrumenter-loader'),
            require('karma-coverage'),
            require('karma-mocha'),
            require('karma-phantomjs-launcher'),
            require('karma-sourcemap-loader'),
            require('karma-spec-reporter'),
            require('karma-webpack'),
        ],
        browsers: ['PhantomJS']
    };
    config.set(configuration);
};
