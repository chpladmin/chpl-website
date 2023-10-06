class ListingPage {
  constructor() {
    this.elements = {
      realWortldTestingHeader: 'h2=Real World Testing',
      seeAllCriteria: '#see-all-criteria',
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

  get seeAllCriteria() {
    return $(this.elements.seeAllCriteria);
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

  async goToDeveloperPageLink(developerName) {
    return $(`//a[text()="${developerName}"]`);
  }

  get listingBasicInformation() {
    return $(this.elements.listingBasicInformation);
  }

  get chplProductNumber() {
    return $(this.elements.chplProductNumber).getText().split(':')[1].trim();
  }

  async previousChplProductNumbers() {
    const pdtnum = await $(this.elements.previousChplProductNumbersTitle).parentElement().$$('li');

    await Promise.all(
      pdtnum.map(async (pnum) => pnum.getText()),
    );
  }
}

export default ListingPage;
