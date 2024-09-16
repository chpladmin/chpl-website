import SearchPage from './search.page';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class ApiDocumentationSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'ApiDocumentationSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Listings',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('api-documentation');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default ApiDocumentationSearchPage;
