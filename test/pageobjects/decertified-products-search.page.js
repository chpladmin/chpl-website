import SearchPage from './search.page';

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
  }

  get downloadListingsButton() {
    return $(this.elements.downloadListingsButton);
  }
}

export default DecertifiedProductsSearchPage;
