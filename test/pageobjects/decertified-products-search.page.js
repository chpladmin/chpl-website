import SearchPage from './search.page';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class DecertifiedProductsSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'DecertifiedProductsSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Decertified Products',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('decertified-products');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default DecertifiedProductsSearchPage;
