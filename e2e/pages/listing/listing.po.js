class ListingPage {
  constructor() {
    this.elements = {
      realWortldTestingHeader: 'h2=Real World Testing',
      seeAllCriteria: '#see-all-criteria',
      editCertifiedProduct: '//span[text()="Edit"]',
      newEditCertifiedProductButton: '//span[text()="Edit - New"]',
      cqmLeftNavButton: '#clinicalQualityMeasures-navigation-button',
      versionSelectHelperText:'#version-select-helper-text',
      reason: '#reason-for-change',
      productHistory: '#view-listing-history',
      goToApi: '#go-to-api',
      manageSurveillanceActivity: '//a[text()="Manage Surveillance Activity"]',
      chplProductNumber: 'p*=15.',
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

  async newEditCertifiedProductButton() {
    await (await $(this.elements.newEditCertifiedProductButton)).click();
  }

  async cqmLeftNavButton() {
    await (await $(this.elements.cqmLeftNavButton)).click();
  }

  async versionSelectHelperText() {
    return (await $(this.elements.versionSelectHelperText)).getText();
  }

  get reason() {
    return $(this.elements.reason);
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

  async chplProductNumber() {
    return (await $(this.elements.chplProductNumber)).getText();
  }

  get previousChplProductNumbers() {
    return $(this.elements.previousChplProductNumbers);
  }

  async previousChplProductNumbers() {
    const pdtnum = await $(this.elements.previousChplProductNumbersTitle).$$('li');

    await Promise.all(
      pdtnum.map(async (pnum) => await pnum.getText()),
    );
  }
}

export default ListingPage;
