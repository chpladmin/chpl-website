class Hooks {
  constructor () { }

  async open(path) {
    await browser.maximizeWindow();
    await browser.setWindowSize(1600, 1024);
    await browser.url(path);
  }

  async waitForSpinnerToDisappear() {
    await browser.waitUntil( async () => !(await $('#loading-bar-spinner').isDisplayed()));
  }

  async waitForSpinnerToAppear() {
    await browser.waitUntil( async () => await $('#loading-bar-spinner').isDisplayed());
  }
  
  async getCellValue(row, col) {
    return $(`//tbody/tr[${row}]/td[${col}]`).getText();
  }

  async getTableHeaders() {
    return (await $('table').$('thead')).$$('th');
  }

  async getFlagState(flagName) {
    const foundFlag = flagObj.find(flag => flag.key === flagName);
    return foundFlag?.active;
  }
  
  async getTableRows() {
    return (await $('table').$('tbody')).$$('tr');
  }

  async getErrors() {
    return $('#action-bar-errors').getText();
  }

}

export default Hooks;
