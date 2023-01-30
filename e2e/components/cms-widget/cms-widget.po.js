const elements = {
  cmsWidget: '#widget-toggle',
  widgetContainer: '#widget-dropdown',
  chplPublicUserGuide: '=CHPL Public User Guide',
  cmsIdReverseLookup: '=CMS ID Reverse Lookup',
  progressBar: '#progress-bar',
  progressBarBar: '#progress-bar-bar',
  progressBarText: '#progress-bar-text',
  certId: '#create-cert-id',
  removeProducts: '#remove-listings',
  baseCriteria: '=Base Criteria',
  compareProducts: '#compare-listings',
  cmsCertificationId: 'strong.ng-binding',
  compareWidgetDropdown: '#compare-widget-dropdown',
  downloadPdf: '#download-cert-id',
  processingSpinner: '#cms-id-processing',
  missingBaseCriteriaListAnd: '#missing-and',
  missingBaseCriteriaListOr: '#missing-or',
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

  get progressBarValue () {
    return $(elements.progressBarBar);
  }

  get progressBarText () {
    return $(elements.progressBarText);
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

  get widgetText () {
    return $(elements.widgetContainer).$$('p');
  }

  get cmsCertificationIdText () {
    return $(elements.cmsCertificationId);
  }

  get compareWidgetDropdown () {
    return $(elements.compareWidgetDropdown);
  }

  get missingBaseCriteriaListAnd () {
    return $(elements.missingBaseCriteriaListAnd);
  }

  get missingBaseCriteriaListOr () {
    return $(elements.missingBaseCriteriaListOr);
  }

  get downloadPdfButton () {
    return $(elements.downloadPdf);
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
