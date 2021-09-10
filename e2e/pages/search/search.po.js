const searchpageElements = {
  chplResource: '#resource-toggle',
  overview: '=Overview',
  compareWidget: '#compare-widget-toggle',
  browseAllOnHomePage: '//button[text()=" Browse all"]',
  searchListing: '#searchField',
  pagination: '.pagination--results-found',
  pageSize: '#pageSizeTop',
  browseAll: '//a[text()="Browse all"]',
  clearFilters: '//a[text()="Clear Filters"]',
  downloadResultsAction: '#results-download-button',
  downloadResults: 'button#dropdown-download-button',
  downloadResultsDropdown: '//chpl-results-download',
  moreFilter: '#filter-more-button',
  moreDeveloper: '#developerRefine',
  moreProduct: '#productRefine',
  moreVersion: '#versionRefine',
  moreCertificationEndDate: '#before',
  morePracticeTypeDropdown: '#st-select-distinct-practiceType',
  complianceNeverHadActivityFilter: '//label/span[text()="Has never had a compliance activity"]',
  complianceHasHadActivityFilter: '#filter-has-had-compliance',
  complianceNeverHadNonConformityFilter: '//label/span[text()="Never had a Non-conformity"]',
  complianceOpenNonConformityFilter: '//label/span[text()="Open Non-conformity"]',
  complianceClosedNonConformityFilter: '//label/span[text()="Closed Non-conformity"]',
  criteria2015FilterExpand: '//a[text()=" View 2015 Certification Criteria "]',
  criteria2015FilterOption: '#filter-list-1',
  edition2014FilterOption: 'input#filter-list-2014',
  statusRetiredFilterOption: 'input#filter-list-Retired',
};

class SearchPage {
  constructor () { }

  get chplResourceButton () {
    return $(searchpageElements.chplResource);
  }

  get overviewPageButton () {
    return $(searchpageElements.overview);
  }

  get compareWidget () {
    return $(searchpageElements.compareWidget);
  }

  get browseAllButton () {
    return $(searchpageElements.browseAllOnHomePage);
  }

  get searchListing () {
    return $(searchpageElements.searchListing);
  }

  get pagination () {
    return $(searchpageElements.pagination);
  }

  get pageSize () {
    return $(searchpageElements.pageSize);
  }

  get browseAll () {
    return $(searchpageElements.browseAll);
  }

  get clearFilters () {
    return $(searchpageElements.clearFilters);
  }

  get downloadResultsAction () {
    return $(searchpageElements.downloadResultsAction);
  }

  get downloadResultsButton () {
    return $(searchpageElements.downloadResults);
  }

  get downloadResultsOptions () {
    return $(searchpageElements.downloadResultsDropdown).$$('li label');
  }

  isDownloadResultsOptionSelected (item) {
    return item.$('input').isSelected();
  }

  getDownloadResultsOptionText (item) {
    return item.getText();
  }

  get moreFilterButton () {
    return $(searchpageElements.moreFilter);
  }

  get moreDeveloperFilter () {
    return $(searchpageElements.moreDeveloper);
  }

  get moreProductFilter () {
    return $(searchpageElements.moreProduct);
  }

  get moreVersionFilter () {
    return $(searchpageElements.moreVersion);
  }

  get moreCertificationEndDateFilter () {
    return $(searchpageElements.moreCertificationEndDate);
  }

  get morePracticeTypeDropdownOptions () {
    return $(searchpageElements.morePracticeTypeDropdown);
  }

  get complianceNeverHadActivityFilter () {
    return $(searchpageElements.complianceNeverHadActivityFilter);
  }

  get complianceHasHadActivityFilter () {
    return $(searchpageElements.complianceHasHadActivityFilter);
  }

  get complianceNeverHadNonConformityFilter () {
    return $(searchpageElements.complianceNeverHadNonConformityFilter);
  }

  get complianceOpenNonConformityFilter () {
    return $(searchpageElements.complianceOpenNonConformityFilter);
  }

  get complianceClosedNonConformityFilter () {
    return $(searchpageElements.complianceClosedNonConformityFilter);
  }

  get criteria2015FilterExpand () {
    return $(searchpageElements.criteria2015FilterExpand);
  }

  get criteria2015FilterOption () {
    return $(searchpageElements.criteria2015FilterOption);
  }

  get edition2014FilterOption () {
    return $(searchpageElements.edition2014FilterOption);
  }

  get statusRetiredFilterOption () {
    return $(searchpageElements.statusRetiredFilterOption);
  }

  moreOncAcbFilterOptions (acbName) {
    return $('#filter-list-' + acbName);
  }

  moreCqmFilterOptions (cmsName) {
    return $('#filter-list-' + cmsName);
  }

  moreFilterExpand (filterOption) {
    return $('//a[text()="' + filterOption + '"]');
  }

  expandFilterOptions (filterName) {
    return $('#filter-' + filterName + '-button');
  }

  gotoResourcePage () {
    this.chplResourceButton.scrollAndClick();
    this.overviewPageButton.scrollAndClick();
  }

  searchForListing (chplId) {
    this.searchListing.clearValue();
    this.searchListing.addValue(chplId);
  }

  listingTableFirstPageRowCount () {
    return $$('//table/tbody/tr').length;
  }

  listingTotalCount () {
    if (this.pagination.isExisting()) {
      return parseInt((this.pagination).$('div div').getText().split(' ')[4], 10);
    }
    return 0;
  }

  getColumnText (rowNumber, columnNumber) {
    return $('//table/tbody/tr[' + rowNumber + ']/td[' + columnNumber + ']').getText();
  }

  /*
   * Check the count of listings, wait a bit, then check again. If it's changed, repeat, else return
   */
  waitForUpdatedListingResultsCount () {
    let start;
    let next;
    do {
      start = this.listingTotalCount();
      browser.pause(2000);
      next = this.listingTotalCount();
    } while (start !== next);
  }

  homeSearchPageButtons (buttonName) {
    return $('//div/a[text()="' + buttonName + '"]');
  }
}

export default SearchPage;
