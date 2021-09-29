const elements = {
  bodyText: 'ai-body-text',
  listingTable: 'table',
  searchBar: '#generalFilter',
  pagination: '.pagination--results-found',
  clearFilters: '//a[text()="Clear Filters"]',
};

class CollectionsPage {
  constructor() { }

  get bodyText() {
    return $(elements.bodyText);
  }

  selectFilter(name, value) {
    if (name === 'nonconformities') {
      $(`#filter-button-${name}`).click();
      $(`#filter-${value}`).click();
    } else {
      $(`#filter-button-${name}`).click();
      $(`#filter-list-${value}`).click();
    }
  }

  get editionFilter() {
    return $(elements.editionFilter);
  }

  get statusFilter() {
    return $(elements.statusFilter);
  }

  get nonConformityFilter() {
    return $(elements.nonConformityFilter);
  }

  get searchBar() {
    return $(elements.searchBar);
  }

  get pagination() {
    return $(elements.pagination);
  }

  get clearFilters() {
    return $(elements.clearFilters);
  }

  getListingTableHeaders() {
    return $(elements.listingTable).$('thead').$$('th');
  }

  searchForListing(text) {
    this.searchBar.clearValue();
    this.searchBar.addValue(text);
  }

  listingTotalCount() {
    if (this.pagination.isExisting()) {
      return parseInt((this.pagination).$('div div').getText().split(' ')[4], 10);
    }
    return 0;
  }

  waitForUpdatedListingResultsCount() {
    let start;
    let next;
    do {
      start = this.listingTotalCount();
      browser.pause(2000);
      next = this.listingTotalCount();
    } while (start !== next);
  }

  getColumnText(rowNumber, columnNumber) {
    return $(`//table/tbody/tr[${rowNumber}]/td[${columnNumber}]`).getText();
  }
}

export default CollectionsPage;
