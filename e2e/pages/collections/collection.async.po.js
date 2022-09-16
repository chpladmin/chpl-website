/* eslint-disable class-methods-use-this */
const elements = {
  table: 'table',
  loading: 'body*=Loading',
  searchResultsHeader: 'h6=Search Results:',
  downloadFilteredListings: '#download-filtered-listings',
  filterPanelToggle: '#filter-panel-toggle',
  resetAllFiltersButton: 'button=Reset All Filters',
  filterSearchTermInput: '#filter-search-term-input',
  filterSearchTermGo: '#filter-search-term-go',
  filterChipsSection: '#filter-chips',
};

class CollectionPage {
  async getTableHeaders() {
    return (await $(elements.table).$('thead')).$$('th');
  }

  async isLoading() {
    return (await $(elements.loading)).isDisplayed();
  }

  async getResults() {
    return (await $(elements.table)
      .$('tbody'))
      .$$('tr');
  }

  async getTableCellText(row, col) {
    return (await row.$$('td'))[col]
      .getText();
  }

  async hasNoResults() {
    return (await (await (await $(elements.searchResultsHeader)
      .parentElement())
      .$('p'))
      .getText()) === 'No results found';
  }

  async getListingTotalCount() {
    const data = (await (await (await $(elements.searchResultsHeader)
      .parentElement())
      .$('p'))
      .getText())
      .split(' ');
    return parseInt(data[2], 10);
  }

  async getListingPageCount() {
    const data = (await (await (await $(elements.searchResultsHeader)
      .parentElement())
      .$('p'))
      .getText())
      .split(' ');
    return parseInt(data[0].split('-')[1], 10);
  }

  async clearSearchTerm() {
    await this.searchForText('');
  }

  async resetFilters() {
    const initialListingCount = await this.getListingTotalCount();
    await $(elements.filterPanelToggle).click();
    await $(elements.resetAllFiltersButton).click();
    await browser.keys('Escape');
    await browser.waitUntil(async () => (await this.getListingTotalCount()) !== initialListingCount);
  }

  async removeFilter(category, value) {
    const initialListingCount = await this.getListingTotalCount();
    await (await (await (await (await (await $(elements.filterChipsSection)
      .$(`p=${category}`))
      .parentElement())
      .$(`span=${value}`))
      .parentElement())
      .$('svg'))
      .click();
    try {
      await browser.waitUntil(async () => (await this.getListingTotalCount()) !== initialListingCount);
    } catch (err) {
      console.log(err);
    }
  }

  async selectFilter(category, value) {
    const initialListingCount = await this.getListingTotalCount();
    await $(elements.filterPanelToggle).click();
    await $(`#filter-panel-primary-items-${category}`).click();
    await $(`#filter-panel-secondary-items-${value}`).click();
    await browser.keys('Escape');
    try {
      await browser.waitUntil(async () => (await this.getListingTotalCount()) !== initialListingCount);
    } catch (err) {
      console.log(err);
    }
  }

  async searchForText(text) {
    const initialListingCount = await this.getListingTotalCount();
    await $(elements.filterSearchTermInput).setValue(text);
    await $(elements.filterSearchTermGo).click();
    try {
      await browser.waitUntil(async () => (await this.getListingTotalCount()) !== initialListingCount);
    } catch (err) {
      console.log(err);
    }
  }
}

export default CollectionPage;
