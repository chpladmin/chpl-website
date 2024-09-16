import SearchPage from './search.page';

const { browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class BannedDevelopersSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'BannedDevelopersSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Banned Developers',
    };
  }

  async open() {
    await super.open('banned-developers');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }
}

export default BannedDevelopersSearchPage;
