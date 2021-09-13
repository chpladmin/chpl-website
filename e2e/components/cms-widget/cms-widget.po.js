const elements = {
  cmsWidget: '#widget-toggle',
  chplPublicUserGuide: '=CHPL Public User Guide',
  cmsIdReverseLookup: '=CMS ID Reverse Lookup',
  progressBar: '.progress-bar',
  certId: '#get-ehr-cert-id',
  removeProducts: '#cms-remove-all',
  baseCriteria: '=Base Criteria',
  compareProducts: '#cms-compare',
  cmsCertificationId: 'strong.ng-binding',
  compareWidgetDropdown: '#compare-widget-dropdown',
  missingBaseCriteriaListOr: '.cms-widget__missing-or',
  missingBaseCriteriaListAnd: '.cms-widget__missing-and',
  downloadPDF: '#download-ehr-cert',
  processingSpinner: '.fa.fa-spinner.fa-spin',
  noProductsSelected: '//*[@id="widget-dropdown"]/ai-cms-widget-display/div/div[1]',
};

class CmsWidgetComponent {
  constructor () { }

  get cmsWidget () {
    return $(elements.cmsWidget);
  }

  get compareProductsButton () {
    return $(elements.compareProducts);
  }

  get chplPublicUserGuideLink () {
    return $(elements.chplPublicUserGuide);
  }

  get cmsIdReverseLookupLink () {
    return $(elements.cmsIdReverseLookup);
  }

  get progressBar () {
    return $(elements.progressBar);
  }

  get getCertIdButton () {
    return $(elements.certId);
  }

  get removeProductsButton () {
    return $(elements.removeProducts);
  }

  get baseCriteriaLink () {
    return $(elements.baseCriteria);
  }

  get noProductsSelectedText () {
    return $(elements.noProductsSelected);
  }

  get cmsCertificationIdText () {
    return $(elements.cmsCertificationId);
  }

  get compareWidgetDropdown () {
    return $(elements.compareWidgetDropdown);
  }

  get missingBaseCriteriaListOr () {
    return $(elements.missingBaseCriteriaListOr);
  }

  get missingBaseCriteriaListAnd () {
    return $(elements.missingBaseCriteriaListAnd);
  }

  get downloadPdfButton () {
    return $(elements.downloadPDF);
  }

  waitForProcessingSpinnerToDisappear () {
    browser.waitUntil( () => !$(elements.processingSpinner).isDisplayed());
  }

  certIdButton (listingId) {
    return $('#toggle-cms-' + listingId);
  }

  addListingToCms (listingId) {
    this.certIdButton(listingId).scrollIntoView({block: 'center', inline: 'center'});
    this.certIdButton(listingId).click();
  }

  addToCms (listingId){
    return $(`#toggle-cms-${listingId}`);
  }
}

export default CmsWidgetComponent;
