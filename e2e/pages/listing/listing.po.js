class ListingPage {
  constructor() {
    this.elements = {
      realWortldTestingHeader: 'h2=Real World Testing',
      seeAll: '#viewAllCerts',
      editCertifiedProduct: '//button[text()=" Edit Certified Product"]',
      reason: '#reason-for-change',
      bypassWarning: '#acknowledge-warnings',
      returnToSearch: '//a[text()=" Return to search results"]',
      productHistory: '#view-listing-history',
      goToApi: '#go-to-api',
      manageSurveillanceActivity: '//a[text()=" Manage Surveillance Activity"]',
    };
  }

  get realWorldTestingHeader() {
    return $(this.elements.realWorldTestingHeader);
  }

  get manageSurveillanceActivity() {
    return $(this.elements.manageSurveillanceActivity);
  }

  get seeAll() {
    return $(this.elements.seeAll);
  }

  get editCertifiedProduct() {
    return $(this.elements.editCertifiedProduct);
  }

  get reason() {
    return $(this.elements.reason);
  }

  get bypassWarning() {
    return $(this.elements.bypassWarning);
  }

  get returnToSearch() {
    return $(this.elements.returnToSearch);
  }

  get productHistory() {
    return $(this.elements.productHistory);
  }

  get goToApi() {
    return $(this.elements.goToApi);
  }

  goToDeveloperPageLink(developerName) {
    return $(`//a[text()="${developerName}"]`);
  }

  listingHistoryModalRows() {
    return $('//*[@id=\'listing-history-title\']/parent::div').$('table').$('tbody').$$('tr');
  }
}

export default ListingPage;
