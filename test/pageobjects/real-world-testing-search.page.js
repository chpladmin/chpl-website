import SearchPage from './search.page';

const { $, browser } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class RealWorldTestingSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'RealWorldTestingSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Real World Testing',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('real-world-testing');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default RealWorldTestingSearchPage;
