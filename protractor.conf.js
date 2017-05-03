'use strict';

var paths = require('./.yo-rc.json')['generator-gulp-angular'].props.paths;

// An example configuration file.
exports.config = {
    allScriptsTimeout: 99999,

    // The address of a running selenium server.
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    //seleniumServerJar: deprecated, this should be set on node_modules/protractor/config.json

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://localhost:3000',

    // cucumber framework
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    ignoreUncaughtExceptions: true,

    // Options to be passed to Cucumber.
    cucumberOpts: {
        // Require files before executing the features.
        require: [
            'features/step_definitions/**/*.js',
            'features/support/**/*.js'
        ],
        // Only execute the features or scenarios with tags matching @dev.
        // This may be an array of strings to specify multiple tags to include.
        // tags: '@dev',
        // How to format features (progress, summary, pretty, json)
        format: ['progress', 'pretty', 'json:test_reports/cucumber_report.json'],
    },

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
