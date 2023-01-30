class CmsWidgetComponent {
  constructor() {
    this.elements = {
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
      toggleCertIdButton: (listingId) => $(`#toggle-cms-${listingId}`),
    };
  }

  get cmsWidget() {
    return $(this.elements.cmsWidget);
  }

  get compareProductsButton() {
    return $(this.elements.compareProducts);
  }

  get chplPublicUserGuideLink() {
    return $(this.elements.chplPublicUserGuide);
  }

  get cmsIdReverseLookupLink() {
    return $(this.elements.cmsIdReverseLookup);
  }

  get progressBar() {
    return $(this.elements.progressBar);
  }

  get progressBarValue() {
    return $(this.elements.progressBarBar);
  }

  get progressBarText() {
    return $(this.elements.progressBarText);
  }

  get getCertIdButton() {
    return $(this.elements.certId);
  }

  get removeProductsButton() {
    return $(this.elements.removeProducts);
  }

  get baseCriteriaLink() {
    return $(this.elements.baseCriteria);
  }

  get widgetText() {
    return $(this.elements.widgetContainer).$$('p');
  }

  get cmsCertificationIdText() {
    return $(this.elements.cmsCertificationId);
  }

  get compareWidgetDropdown() {
    return $(this.elements.compareWidgetDropdown);
  }

  get missingBaseCriteriaListAnd() {
    return $(this.elements.missingBaseCriteriaListAnd);
  }

  get missingBaseCriteriaListOr() {
    return $(this.elements.missingBaseCriteriaListOr);
  }

  get downloadPdfButton() {
    return $(this.elements.downloadPdf);
  }

  waitForProcessingSpinnerToDisappear() {
    browser.waitUntil(() => !$(this.elements.processingSpinner).isDisplayed());
  }

  certIdButton(listingId) {
    return this.elements.toggleCertIdButton(listingId);
  }

  addListingToCms(listingId) {
    this.certIdButton(listingId).scrollIntoView({ block: 'center', inline: 'center' });
    this.certIdButton(listingId).click();
  }

  addToCms(listingId) {
    return this.certIdButton(listingId);
  }
}

export default CmsWidgetComponent;
