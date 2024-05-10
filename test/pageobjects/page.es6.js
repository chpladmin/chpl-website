const { browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

/**
 * main page object containing all methods, selectors and functionality
 * that is shared across all page objects
 */
class Page {
  constructor() {
    this.elements = {};
  }
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  open (path) {
    return browser.url(`#/${path}`);
  }
}

export default Page;
