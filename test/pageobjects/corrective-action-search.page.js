import SearchPage from './search.page';

class CorrectiveActionSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'CorrectiveActionSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Listings',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('corrective-action');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default CorrectiveActionSearchPage;
