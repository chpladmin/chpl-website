import SearchPage from './search.page';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class ListingSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'ListingSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=CHPL Listings',
      composeMessageButton: '#compose-message',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('search');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get composeMessageButton() {
    return $(this.elements.composeMessageButton);
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }

  async browse() {
    await (
      await $(this.elements.filterBrowse)
    ).click();
    try {
      await browser.waitUntil(async () => (await this.getTableHeaders()).length > 0);
    } catch (err) {
      console.log(`browse: ${err}`);
    }
  }
}

export default ListingSearchPage;
