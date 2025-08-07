import SearchPage from './search.page';

class SedSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'SedSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=SED Information',
      downloadListingsButton: '#download-listings',
    };
  }

  async open() {
    await super.open('sed');
    await (browser.waitUntil(async () => !(await this.isSkeletonVisible())));
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default SedSearchPage;
