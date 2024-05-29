import SearchPage from './search.page';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class DeveloperSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'DeveloperSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Developers',
      composeMessageButton: '#compose-message',
    };
  }

  async open() {
    await super.open('organizations/developers');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get composeMessageButton() {
    return $(this.elements.composeMessageButton);
  }
}

export default DeveloperSearchPage;
