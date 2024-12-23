import Page from './page.es6';

class OverviewPage extends Page {
  constructor() {
    super();
    this.name = 'Developer';
    this.elements = {
      ...this.elements,
      editDeveloperButton: '#developer-component-edit',
      filterPanelPrimaryItems: (category) => `#filter-panel-primary-items-${category}`,
      filterPanelSecondaryItems: (value) => `#filter-panel-secondary-items-${value}`,
      filterPanelToggle: '#filter-panel-toggle',
      listingsTable: 'aria/Listings table',
      mergeProductButton: (productId) => `#merge-${productId}`,
      productSummary: '.MuiAccordionSummary-root',
      products: '.MuiAccordion-root',
      productsSearchPanelTitle: '.MuiTypography-h5=Products',
      title: 'h1',
      versionSelect: '#version',
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

  async filterBy(category, value) {
    const productsPanel = await this.getProductsPanel();
    const advancedSearch = productsPanel.$(this.elements.filterPanelToggle);
    const categoryButton = $(this.elements.filterPanelPrimaryItems(category));
    const valueButton = $(this.elements.filterPanelSecondaryItems(value));
    await advancedSearch.click();
    await categoryButton.waitForClickable();
    await categoryButton.click();
    await valueButton.waitForClickable();
    await valueButton.click();
    await browser.keys('Escape');
  }

  async getListings(productName) {
    const product = await this.getProduct(productName);
    const table = await product.$(this.elements.listingsTable);
    const body = await table.$('tbody');
    const rows = await body.$$('tr');
    return rows;
  }

  async getMergeProductButton(productId) {
    return $(this.elements.mergeProductButton(productId));
  }

  async getProduct(product) {
    const products = await this.getProducts();
    return products
      .find(async (p) => (await
      (await this.getProductName(p))
        .getText()) === product);
  }

  async getProductName(product) {
    const summary = product.$(this.elements.productSummary);
    return summary.$$('p')[0];
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

  async getVersionOptions(productName) {
    const product = await this.getProduct(productName);
    await this.viewProduct(productName);
    const select = await product.$(this.elements.versionSelect);
    await select.scrollIntoView();
    await select.click();
    const options = await $$('[role="option"]');
    await options.forEach(async (option) => option.getText()); // I don't know why this is required, but without it the value "All" is not populated in the returned array
    return options;
  }

  async viewProduct(productName) {
    const product = await this.getProduct(productName);
    const button = await product.$('.MuiAccordionSummary-root');
    await button.click();
  }
}

export default OverviewPage;
