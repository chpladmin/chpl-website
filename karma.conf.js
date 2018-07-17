'use strict';
var webpack = require('webpack');
var path = require('path');
var conf = require('./gulp/conf');

const webpackConfig = require('./webpack.test');

//process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    var configuration = {
        files: [
            'src/app/specs.js',
        ],
        frameworks: ['mocha'],
        preprocessors: {
            'src/app/specs.js': ['webpack'],
        },
        reporters: ['spec'/*, 'coverage'*/],
        coverageReporter: {
            dir: 'build/coverage/',
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
            require("karma-webpack"),
            require("istanbul-instrumenter-loader"),
            require("karma-mocha"),
            require("karma-coverage"),
            require("karma-phantomjs-launcher"),
            require("karma-spec-reporter")
        ],
        browsers: ['PhantomJS']
    };
    config.set(configuration);
};
