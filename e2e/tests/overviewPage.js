const assert = require('assert')
const config = require('../config/mainConfig.js');



describe('Developer dashboard page', () => {
  it('should open for developer role', () => {
    browser.url('');
    $('#login-toggle').click();
    $('[name="username"]').setValue(config.UserName);
    $('[name="password"]').setValue(config.Password);
    $('button=Log In').click();
    browser.pause(30000);
    const url = browser.getUrl();
    assert.strictEqual(url, 'https://chpl-qa.ahrqdev.org/#/dashboard');
  })
  it('should say deverloper name', () => {
    const developerName = $('.panel-title.ng-binding').getText();
    assert.strictEqual(developerName, 'Health Metrics System, Inc');
  })
})
