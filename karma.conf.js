'use strict';

var path = require('path');
var conf = require('./gulp/conf');

const webpackConfig = require('./webpack.test');

process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = function(config) {
    var configuration = {
        browserDisconnectTimeout: 60000,
        browserNoActivityTimeout: 60000,
        browserDisconnectTolerance: 10,
        logLevel: 'WARN',
        frameworks: ['phantomjs-shim', 'jasmine'],
        browsers : ['PhantomJS', 'ChromeHeadless'],
        webpack: webpackConfig,
        webpackMiddleware: {
//            noInfo: true,
            stats: 'minimal',
        },
//        proxies: {
//            '/assets/': path.join('/base/', conf.paths.src, '/assets/')
//        },
    };

    /*************************
     * Files and preprocessors configurations
     * The first section is the way all of the examples online are the way it "should" work, but no tests run
     * The second is a way to run the tests, but they all fail, I think because they don't have "angular" as an import;
     * they should, I think, because they're under the specs.js, which imports index.js, which has angular, but it doesn't seem to work.
     *************************/
    // Use this section when using specs.js, the way it _should_ work
    configuration.files = ['src/app/specs.js'];
    configuration.preprocessors = { 'src/app/specs.js': ['webpack', 'sourcemap'] }
    // Use this to show that something does happen, but the spec files don't have access to angular the way they should (I think)
    //configuration.files = ['src/app/specs.js', 'src/app/**/*.spec.js'];
    //configuration.preprocessors = { 'src/app/specs.js': ['webpack'], 'src/app/**/*.spec.js': ['babel'] };

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
