const path = require('path');
const fs = require('fs');
const config = require('./e2e/config/mainConfig');
const urls = require('./e2e/config/urls');

const downloadDir = path.join(`${__dirname}`, 'test_reports/e2e/');

// Store the directory path in a global, which allows us to access this path inside our tests
global.downloadDir = downloadDir;

let baseUrl = 'http://localhost:3000/';
if (process.env.ENV) {
  baseUrl = urls[`${process.env.ENV}URL`];
}
exports.config = {
  runner: 'local',
  path: '/',
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
  exclude: [
    // 'path/to/excluded/files'
  ],
  maxInstances: 1,
  capabilities: [{
    maxInstances: 1,
    browserName: config.browser,
    'goog:chromeOptions': {
      args: ['--headless', '--dissable-gpu', '--no-sandbox',
        'disable-extensions',
        'safebrowsing-disable-extension-blacklist',
        'safebrowsing-disable-download-protection'],
      prefs: {
        directory_upgrade: true,
        prompt_for_download: false,
        'download.default_directory': downloadDir,
        'safebrowsing.enabled': true,
      },
    },
  }],
  logLevel: config.logLevel,
  bail: 0,
  baseUrl,
  waitforTimeout: config.longTimeout,
  connectionRetryTimeout: 10000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  framework: 'jasmine',
  jasmineOpts: { // used to be jasmineNodeOpts; when jasmine.DEFAULT_TIMEOUT_INTERVAL is 10000 this isn't being taken into account
    ui: 'bdd',
    defaultTimeoutInterval: 80000,
    requires: ['@babel/register'], // think this is the new one
    helpers: [require.resolve('@babel/register')], // not sure if this is needed
    expectationResultHandler(passed, assertion) {
      if (passed) {
        return;
      }
      const message = assertion.error.message.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const location = `${__dirname}/test_reports/e2e/screenshot/assertionError_${message}.png`;
      console.log(`Saving screenshot: ${location}`);
      browser.saveScreenshot(location);
    },
  },
  reporters: [
    'spec',
    ['junit', {
      outputDir: './test_reports/e2e/junitreport',
      outputFileFormat: () => `wdio-${(new Date()).getTime()}-junit-reporter.xml`,
    }],
    ['allure', {
      outputDir: '/chpl/dev/allure/results/',
      disableWebdriverStepsReporting: true,
      disableWebdriverScreenshotsReporting: false,
    }],
  ],
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare() {
    // make sure download directory exists
    if (!fs.existsSync(downloadDir)) {
      console.log(`making directory "${downloadDir}`);
      fs.mkdirSync(downloadDir);
    }
    if (!fs.existsSync(`${downloadDir}screenshot`)) {
      console.log(`making directory "${downloadDir}screenshot`);
      fs.mkdirSync(`${downloadDir}screenshot`);
    }
  },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  beforeSession() {
    require('@babel/register');
  },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before() {
    browser.addCommand('getFlag', () => {
      browser.url(this.baseUrl + urls.ff4jURL);
      const json = $('body').getText();
      const jsonObj = JSON.parse(json);
      return jsonObj;
    });
    global.flagObj = browser.getFlag();
    browser.addCommand('waitAndClick', async function () {
      // `this` is return value of $(selector), but only when not using shorthand function definitions
      await this.waitForDisplayed();
      await this.click();
    }, true);
    /**
     * Attempt to scroll to element if it is not clickable.
     * Pass { force: true } to click with JS even if element is not visible or clickable.
     */
    // 'click'            - name of command to be overwritten
    // origClickFunction  - original click function
    browser.overwriteCommand('click', function (origClickFunction, { force = false } = {}) {
      if (!force) {
        try {
          // attempt to click
          return origClickFunction()
        } catch (err) {
          if (err.message.includes('not clickable at point')) {
            console.warn('WARN: Element', this.selector, 'is not clickable.',
              'Scrolling to it before clicking again.')
            // scroll to element and click again
            this.scrollIntoView({ block: 'center', inline: 'center' })
            return origClickFunction()
          }
          throw err
        }
      }
      // clicking with js
      console.warn('WARN: Using force click for', this.selector)
      browser.execute((el) => {
        el.click()
      }, this)
    }, true); // don't forget to pass `true` as 3rd argument
    browser.addCommand('waitForFileExists', (filePath, timeout) => new Promise(((resolve, reject) => {
      const dir = path.dirname(filePath);
      const basename = path.basename(filePath);
      const watcher = fs.watch(dir, (eventType, filename) => {
        if (eventType === 'rename' && filename === basename) {
          clearTimeout(timer);
          watcher.close();
          resolve();
        }
      });
      const timer = setTimeout(() => {
        watcher.close();
        reject(new Error('File did not exist and was not created before the timeout.'));
      }, timeout);
      fs.access(filePath, fs.constants.R_OK, (err) => {
        if (!err) {
          clearTimeout(timer);
          watcher.close();
          resolve();
        }
      });
    })));
  },
  afterTest() {
    //console.log('start afterTestHook', browser.getLogs('browser'), 'end afterTestHook');
  },
};
