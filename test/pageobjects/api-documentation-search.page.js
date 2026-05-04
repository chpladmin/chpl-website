import SearchPage from './search.page';

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
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default ApiDocumentationSearchPage;
