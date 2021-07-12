const urls = require('../config/urls');
class Hooks {
  constructor () { }

  open (path) {
    browser.maximizeWindow();
    browser.setWindowSize(1600, 1024);
    browser.url(path);
  }

  waitForSpinnerToDisappear () {
    browser.waitUntil( () => !$('#loading-bar-spinner').isDisplayed());
  }

  waitForSpinnerToAppear () {
    browser.waitUntil( () => $('#loading-bar-spinner').isDisplayed());
  }

  getFlagState(flagName){
    browser.url(browser.options.baseUrl + urls.ff4jURL);
    let jsonObj= JSON.parse($('body').getText())
    const foundFlag = jsonObj.find(flag => flag.key === flagName);
    return foundFlag?.active;
  }
}

export default Hooks;
