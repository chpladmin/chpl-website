class ManagePage {
  constructor() {
    this.elements = {
      pagination: '.pagination--results-found',
      clearFilters: '//button[text()="Clear Filters"]',
      initiate: '//button[text()= "Initiate Surveillance Reporting"]'
    };
  }

  totalCount () {
    if ($(this.elements.pagination).isExisting()) {
      return parseInt($(this.elements.pagination).$('div div').getText().split(' ')[4], 10);
    }
    return 0;
  }

  expandFilterOptions (filterName) {
    $(`#filter-button-${filterName}`).click();
  }

  chooseFilter(option) {
    $(`#filter-list-${option}`).click();
  }

  chooseSurveillanceFilter(option) {
    $(`#filter-${option}`).click();
  }

  get clearFilters () {
    return $(this.elements.clearFilters);
  }

  waitForUpdatedResultsCount () {
    let start;
    let next;
    do {
      start = this.totalCount();
      browser.pause(2000);
      next = this.totalCount();
    } while (start !== next);
  }

  totalSurveillance () {
    return $('ai-surveillance').$('.inset-content').$$('div').length;
  }

  clickOnListing (listing) {
    $(`//button[text()= "${listing} "]`).click();
  }

  openListingTab (listing){
    $(`//*[text()= " ${listing} "]`).click();
  }

  get initiateSurveillanceButton () {
    return $(this.elements.initiate);
  }

  search (text) {
    $('#generalFilter').setValue(text);
  }

}

export default ManagePage;
