/* eslint-disable class-methods-use-this */
const elements = {
  bodyText: '.makeStyles-content-3',
  table: 'table',
  searchResultsHeader: 'h6=Search Results:',
  filterPanelToggle: '#filter-panel-toggle',
  resetAllFiltersButton: 'button=Reset All Filters',
  filterSearchTermInput: '#filter-search-term-input',
  filterSearchTermGo: '#filter-search-term-go',
};

class CollectionPage {
  get bodyText() {
    return $(elements.bodyText);
  }

  getTableHeaders() {
    return $(elements.table).$('thead').$$('th');
  }

  get results() {
    return $(elements.table)
      .$('tbody')
      .$$('tr');
  }

  getTableCellText(row, col) {
    return row.$$('td')[col]
      .getText();
  }

  getListingTotalCount() {
    const data = $(elements.searchResultsHeader)
      .parentElement()
      .$('p')
      .getText()
      .split(' ');
    return parseInt(data[2], 10);
  }

  getListingPageCount() {
    const data = $(elements.searchResultsHeader)
      .parentElement()
      .$('p')
      .getText()
      .split(' ');
    return parseInt(data[0].split('-')[1], 10);
  }

  clearSearchTerm() {
    this.searchForText('');
  }

  resetFilters() {
    const initialListingCount = this.getListingTotalCount();
    $(elements.filterPanelToggle).click();
    $(elements.resetAllFiltersButton).click();
    browser.keys('Escape');
    browser.waitUntil(() => this.getListingTotalCount() !== initialListingCount);
  }

  removeFilter(category, value) {
    const initialListingCount = this.getListingTotalCount();
    $(`span=${category}: ${value}`)
      .parentElement()
      .$('svg')
      .click();
    browser.waitUntil(() => this.getListingTotalCount() !== initialListingCount);
  }

  selectFilter(category, value) {
    const initialListingCount = this.getListingTotalCount();
    $(elements.filterPanelToggle).click();
    $(`#filter-panel-primary-items-${category}`).click();
    $(`#filter-panel-secondary-items-${value}`).click();
    browser.keys('Escape');
    try {
      browser.waitUntil(() => this.getListingTotalCount() !== initialListingCount);
    } catch (err) {
      console.log(err);
    }
  }

  searchForText(text) {
    const initialListingCount = this.getListingTotalCount();
    $(elements.filterSearchTermInput).setValue(text);
    $(elements.filterSearchTermGo).click();
    try {
      browser.waitUntil(() => this.getListingTotalCount() !== initialListingCount);
    } catch (err) {
      console.log(err);
    }
  }
}

export default CollectionPage;
