const { browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
class Page {
  constructor() {
    this.name = 'Page';
    this.elements = {};
    this.width = 1600;
    this.height = 1024;
  }

  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  async open(path) {
    await browser.setWindowSize(this.width, this.height);
    return browser.url(`#/${path}`);
  }
}

export default Page;
