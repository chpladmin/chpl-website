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
  getTableHeaders() {
    return $(elements.table).$('thead').$$('th');
  }

  get isLoading() {
    return $(elements.loading).isDisplayed();
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

  hasNoResults() {
    return $(elements.searchResultsHeader)
      .parentElement()
      .$('p')
      .getText() === 'No results found';
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

  get downloadFilteredListings() {
    return $(elements.downloadFilteredListings);
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
    $(elements.filterChipsSection)
      .$(`p=${category}`)
      .parentElement()
      .$(`span=${value}`)
      .parentElement()
      .$('svg')
      .click();
    try {
      browser.waitUntil(() => this.getListingTotalCount() !== initialListingCount);
    } catch (err) {
      console.log(err);
    }
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
