const searchpageElements = {
  chplResource: '#resource-toggle',
  overview: '=Overview',
  compareWidget: '#compare-widget-toggle',
  browseAllOnHomePage: '//button[text()=" Browse all"]',
  searchListing: '#searchField',
  pagination: '//table/thead/tr[1]/td/div/div/div/div',
  pageSize: '#pageSizeTop',
  browseAll: '//a[text()="Browse all"]',
  clearFilters: '//a[text()="Clear Filters"]',
  downloadResultsAction: '#results-download-button',
  downloadResults: 'button#dropdown-download-button',
  moreFilter: '#filter-more-button',
  moreDeveloper: '#developerRefine',
  moreProduct: '#productRefine',
  moreVersion: '#versionRefine',
  moreCertificationEndDate: '#before',
  morePracticeTypeDropdown: '#st-select-distinct-practiceType',
  surveillanceNeverHadFilter: '#filter-has-never-had-surveillance',
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

  get surveillanceNeverHadFilter () {
    return $(searchpageElements.surveillanceNeverHadFilter);
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
    this.chplResourceButton.click();
    this.overviewPageButton.click();
  }

  searchForListing (chplId) {
    this.searchListing.clearValue();
    this.searchListing.addValue(chplId);
  }

  listingTableFirstPageRowCount () {
    return $$('//table/tbody/tr').length;
  }

  listingTotalCount () {
    return parseInt(this.pagination.getText().split(' ')[4], 10);
  }

  getColumnText (rowNumber, columnNumber) {
    return $('//table/tbody/tr[' + rowNumber + ']/td[' + columnNumber + ']').getText();
  }
  // There is no spinner or other indication on search page to make browser wait until listing results are updating
  // Hoping with redesigning of search page, this timeout won't be needed
  waitForUpdatedListingResultsCount () {
    browser.pause(10000);
  }

  homeSearchPageButtons (buttonName) {
    return $('//div/a[text()="' + buttonName + '"]');
  }
}

export default SearchPage;
