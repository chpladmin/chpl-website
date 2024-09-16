import SearchPage from './search.page';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class SvapSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'SvapSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=SVAP Information',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('svap');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default SvapSearchPage;
