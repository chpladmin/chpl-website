import SearchPage from './search.page';

class InactiveCertificatesSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'InactiveCertificatesSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Inactive Certificates',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('inactive-certificates');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default InactiveCertificatesSearchPage;
