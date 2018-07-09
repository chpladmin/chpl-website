'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var webpackConfig = require('./webpack.config');
const webpackMerge = require('webpack-merge');
const webpackTestConfig = webpackMerge(webpackConfig({prod: false}), {
    entry: './src/app/specs.js',
});

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    var configuration = {
        files: [
            //'src/app/index.js',
            'src/app/specs.js',
            //'src/app/**/*.spec.js',
        ],
        browserDisconnectTimeout: 60000,
        browserNoActivityTimeout: 60000,
        browserDisconnectTolerance: 10,
        preprocessors: {
            //'src/app/index.js': ['webpack'],
            'src/app/specs.js': ['webpack'],
            //'src/app/**/*.spec.js': ['babel'],
        },
        logLevel: 'WARN',
        frameworks: ['phantomjs-shim', 'jasmine'],
        browsers : ['PhantomJS', 'ChromeHeadless'],
        webpack: webpackTestConfig,
        webpackMiddleware: {
            noInfo: true
        },
        proxies: {
            '/assets/': path.join('/base/', conf.paths.src, '/assets/')
        },
    };
    configuration.webpack.plugins = [];
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
