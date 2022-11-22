class CmsLookupPage {
  constructor () {
    this.elements = {
      chips: '#chips',
      resultsTable: 'table[aria-label="CMS ID Listing Data table"',
      searchField: '#search-term-input',
      searchGo: '#search-term-go',
      downloadResultsButton: `#download-listing-data`,
      invalidText: (cmsId) => `li*=${cmsId}`,
    };
  }

  clear() {
    $(this.elements.chips).$$('svg').forEach((chip) => chip.click());
    browser.waitUntil(() => !$(this.elements.resultsTable).isDisplayed());
  }

  search(cmsId) {
    $(this.elements.searchField).setValue(cmsId);
    $(this.elements.searchGo).click();
    browser.waitUntil(() => this.getInvalidText(cmsId).isDisplayed() || ($(this.elements.resultsTable).isDisplayed() && this.getResults().length > 0));
  }

  getResults() {
    return $(this.elements.resultsTable).$('tbody').$$('tr');
  }

  getInvalidText(cmsId) {
    return $(this.elements.invalidText(cmsId));
  }

  get downloadResultsButton () {
    return $(this.elements.downloadResultsButton);
  }
}

export default CmsLookupPage;
