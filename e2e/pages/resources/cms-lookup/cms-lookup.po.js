class CmsLookupPage {
  constructor() {
    this.elements = {
      chips: '#chips',
      resultsTable: 'table[aria-label="CMS ID Listing Data table"',
      searchField: '#search-term-input',
      searchGo: '#search-term-go',
      downloadResultsButton: '#download-listing-data',
      invalidText: async (cmsId) => `li*=${cmsId}`,
    };
  }

  async clear() {
    const chips = await $(this.elements.chips).$$('svg');

    await Promise.all(
      chips.map(async (chip) => chip.click()),
    );
    await browser.waitUntil(async () => !(await $(this.elements.resultsTable).isDisplayed()));
  }

  async search(cmsId) {
    await (await $(this.elements.searchField)).setValue(cmsId);
    await (await $(this.elements.searchGo)).click();
    await browser.waitUntil(async () => (await (await this.getInvalidText(cmsId)).isDisplayed()) || ((await $(this.elements.resultsTable).isDisplayed()) && (await this.getResults()).length > 0));
  }

  async getResults() {
    return (await $(this.elements.resultsTable).$('tbody')).$$('tr');
  }

  async getInvalidText(cmsId) {
    return $(await this.elements.invalidText(cmsId));
  }

  get downloadResultsButton() {
    return $(this.elements.downloadResultsButton);
  }
}

export default CmsLookupPage;
