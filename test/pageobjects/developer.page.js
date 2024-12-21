import Page from './page.es6';

class OverviewPage extends Page {
  constructor() {
    super();
    this.name = 'Developer';
    this.elements = {
      ...this.elements,
      editDeveloperButton: '#developer-component-edit',
      productSummary: '.MuiAccordionSummary-root',
      products: '.MuiAccordion-root',
      productsSearchPanelTitle: '.MuiTypography-h5=Products',
      title: 'h1',
    };
  }

  async open(id) {
    await super.open(`organizations/developers/${id}`);
  }

  get editDeveloperButton() { return $(this.elements.editDeveloperButton); }

  get title() { return $(this.elements.title); }

  async browseAllListings() {
    const productsPanel = await this.getProductsPanel();
    await (
      await (
        await productsPanel.$('#filter-chips')
      ).$$('[role="button"]')
    ).forEach(async (chip) => {
      const btn = await chip.$('svg');
      return btn.click();
    });
  }

  async getProductName(product) {
    const summary = await product.$(this.elements.productSummary);
    return summary.$$('p');
  }

  async getProducts() {
    const productsPanel = await this.getProductsPanel();
    return productsPanel.$$(this.elements.products);
  }

  async getProductsPanel() {
    return (
      await (
        await (
          await $(this.elements.productsSearchPanelTitle)
        ).parentElement()
      ).parentElement()
    ).parentElement();
  }

  async getProductsSearchResults() {
    const productsPanel = await this.getProductsPanel();
    return (
      await productsPanel.$('h6=Search Results:')
    ).parentElement();
  }
}

export default OverviewPage;
