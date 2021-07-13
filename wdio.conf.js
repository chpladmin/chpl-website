const config = require('./e2e/config/mainConfig');
const path = require('path');
const fs = require('fs');
const urls = require('./e2e/config/urls');

// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = path.join(`${__dirname}`, 'test_reports/e2e/');

let baseUrl='http://localhost:3000/';
if (process.env.ENV === 'dev') {
  baseUrl = urls.devURL
}
else if (process.env.ENV === 'qa') {
  baseUrl = urls.qaURL
}
else if (process.env.ENV === 'stage') {
  baseUrl = urls.stageURL
}
exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // Override default path ('/wd/hub') for chromedriver service.
  path: '/',
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [
    'e2e/**/*.spec.js',
  ],
  suites: {
    components: [
      'e2e/components/**/*.spec.js',
    ],
    pages: [
      'e2e/pages/**/*.spec.js',
    ],
    readonly: [
      'e2e/**/*.readonly.spec.js',
    ],
  },
  // Patterns to exclude.
  exclude: [
    // 'path/to/excluded/files'
  ],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: [{

    // maxInstances can get overwritten per capability. So if you have an in-house Selenium
    // grid with only 5 firefox instances available you can make sure that not more than
    // 5 instances get started at a time.
    maxInstances: 1,
    //
    browserName: config.browser,
    'goog:chromeOptions': {
      args: ['--headless', '--dissable-gpu', '--no-sandbox' ,
      'disable-extensions',
      'safebrowsing-disable-extension-blacklist',
      'safebrowsing-disable-download-protection'],
      prefs: {
        'directory_upgrade': true,
        'prompt_for_download': false,
        'download.default_directory': downloadDir,
        'safebrowsing.enabled': true
      }
    },
    // If outputDir is provided WebdriverIO can capture driver session logs
    // it is possible to configure which logTypes to include/exclude.
    // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
    // excludeDriverLogs: ['bugreport', 'server'],
  }],
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: config.logLevel,
  //outputDir: `${__dirname}/e2e/logs`,
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: config.longTimeout,
  //
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 10000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: ['chromedriver'],

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  framework: 'jasmine',
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  jasmineNodeOpts: {
    ui: 'bdd',
    defaultTimeoutInterval: 60000,
    helpers: [require.resolve('@babel/register')],
    expectationResultHandler: function (passed, assertion) {
      if (passed) {
        return;
      }
      var message = assertion.error.message.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      var location = `${__dirname}/test_reports/e2e/screenshot/assertionError_${message}.png`;;
      browser.saveScreenshot(location);
    }
  },

  //
  // The number of times to retry the entire specfile when it fails as a whole
  //specFileRetries: 1,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  reporters: [
    'spec',
    ['junit', {
      outputDir: './test_reports/e2e/junitreport',
      outputFileFormat: options => 'wdio-' + (new Date()).getTime() + '-junit-reporter.xml',
    }],
    ['allure', {
      outputDir: '/chpl/dev/allure/results/',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],

  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: function (config, capabilities) {
    // make sure download directory exists
    if (!fs.existsSync(downloadDir)){
      fs.mkdirSync(downloadDir);
    }
    if (!fs.existsSync(downloadDir + 'screenshot')){
      fs.mkdirSync(downloadDir + 'screenshot');
    }
  },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession: function (config, capabilities, specs) {
    require('@babel/register');
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: function (capabilities, specs) {
    assert = require('chai').assert;
    browser.addCommand('getFlag', function () {
      this.url(this.options.baseUrl + urls.ff4jURL);
      let jsonObj= JSON.parse($('body').getText())
      return jsonObj;
    })
    global.flagObj= browser.getFlag();
    browser.addCommand("waitAndClick", function () {
      // `this` is return value of $(selector)
      this.waitForDisplayed()
      this.click()
    }, true)

    //element wrapped in div is not clickable solution
    browser.addCommand("scrollAndClick", function () {
      // `this` is return value of $(selector)
      var runInBrowser = function (argument) {
        argument.click();
      };
      this.scrollIntoView({block: 'center', inline: 'center'});
      browser.execute(runInBrowser,this);
    }, true)

    browser.addCommand("waitForFileExists", function (filePath, timeout) {
      return new Promise(function (resolve, reject) {
        var timer = setTimeout(function () {
          watcher.close();
          reject(new Error('File did not exist and was not created before the timeout.'));
        }, timeout);

        fs.access(filePath, fs.constants.R_OK, function (err) {
          if (!err) {
            clearTimeout(timer);
            watcher.close();
            resolve();
          }
        });

        var dir = path.dirname(filePath);
        var basename = path.basename(filePath);
        var watcher = fs.watch(dir, function (eventType, filename) {
          if (eventType === 'rename' && filename === basename) {
            clearTimeout(timer);
            watcher.close();
            resolve();
          }
        });
      });
    });
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Hook that gets executed before the suite starts
   * @param {Object} suite suite details
   */
  // beforeSuite: function (suite) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: function (test, context) {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine).
   */
  //afterTest: function(test, context, { error, result, duration, passed, retries }) {
  afterTest: function () {
    console.log(browser.getLogs('browser')); //Adding this to capture console logs for some of the failing AQA tests
  },
  /**
   * Hook that gets executed after the suite has ended
   * @param {Object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  // onComplete: function(exitCode, config, capabilities, results) {

  // },
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  //onReload: function(oldSessionId, newSessionId) {
  //}
}
