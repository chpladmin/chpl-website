import Page from './page.es6';

class OverviewPage extends Page {
  constructor() {
    super();
    this.name = 'Developer';
    this.elements = {
      ...this.elements,
      editDeveloperButton: '#developer-component-edit',
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
    const productsPanel = await (
          await (
            await (
              await $(this.elements.productsSearchPanelTitle)
            ).parentElement()
          ).parentElement()
    ).parentElement();
    await (await (await productsPanel.$('#filter-chips')).$$('[role="button"]')).forEach(async (chip) => {
      const btn = await chip.$('svg');
      return btn.click();
    });
  }

  async getProductsSearchResults() {
    return (
      await (
        await (
          await (
            await (
              await $(this.elements.productsSearchPanelTitle)
            ).parentElement()
          ).parentElement()
        ).parentElement()
      ).$('h6=Search Results:')
    ).parentElement();
  }
}

export default OverviewPage;
