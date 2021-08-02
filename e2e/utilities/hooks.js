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
    const foundFlag = flagObj.find(flag => flag.key === flagName);
    return foundFlag?.active;
  }
  
  getTableRows() {
    return $('table').$('tbody').$$('tr');
  }
}

export default Hooks;
