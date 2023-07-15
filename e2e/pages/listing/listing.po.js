class ListingPage {
  constructor() {
    this.elements = {
      realWortldTestingHeader: 'h2=Real World Testing',
      seeAll: '#viewAllCerts',
      editCertifiedProduct: '//span[text()="Edit"]',
      reason: '#reason-for-change',
      bypassWarning: '#acknowledge-warnings',
      productHistory: '#view-listing-history',
      goToApi: '#go-to-api',
      manageSurveillanceActivity: '//a[text()="Manage Surveillance Activity"]',
      listingHistoryTitle: '#listing-history-title',
      chplProductNumber: 'p*=CHPL Product Number:',
      previousChplProductNumbersTitle: 'p=Previous CHPL Product Numbers',
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

  get productHistory() {
    return $(this.elements.productHistory);
  }

  get goToApi() {
    return $(this.elements.goToApi);
  }

  goToDeveloperPageLink(developerName) {
    return $(`//a[text()="${developerName}"]`);
  }

  get listingBasicInformation() {
    return $(this.elements.listingBasicInformation);
  }

  get chplProductNumber() {
    return $(this.elements.chplProductNumber).getText().split(':')[1].trim();
  }

  get previousChplProductNumbers() {
    return $(this.elements.previousChplProductNumbersTitle)
      .parentElement()
      .$$('li')
      .map((ele) => ele.getText());
  }
}

export default ListingPage;
