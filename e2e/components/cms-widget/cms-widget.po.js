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
      cmsCertificationId: '#ehr-cert-id',
      compareWidgetDropdown: '#compare-widget-dropdown',
      downloadPdf: '#download-cert-id',
      processingSpinner: '#cms-id-processing',
      missingBaseCriteriaListAnd: '#missing-and',
      missingBaseCriteriaListOr: '#missing-or',
      toggleCertIdButton: async listingId => $(`#toggle-cms-${listingId}`),
    };
  }

  get cmsWidget() {
    return $(this.elements.cmsWidget);
  }

  async compareProductsButton() {
    return $(this.elements.compareProducts);
  }

  get chplPublicUserGuideLink() {
    return $(this.elements.chplPublicUserGuide);
  }

  async cmsIdReverseLookupLink() {
    return $(this.elements.cmsIdReverseLookup);
  }

  get progressBar() {
    return $(this.elements.progressBar);
  }

  async progressBarValue() {
    return $(this.elements.progressBarBar);
  }

  get progressBarText() {
    return $(this.elements.progressBarText);
  }

  async getCertIdButton() {
    return $(this.elements.certId);
  }

  async removeProductsButton() {
    return $(this.elements.removeProducts);
  }

  async baseCriteriaLink() {
    return $(this.elements.baseCriteria);
  }

  get widgetText() {
    return $(this.elements.widgetContainer).$$('p');
  }

  async cmsCertificationIdText() {
    return $(this.elements.cmsCertificationId);
  }

  async compareWidgetDropdown() {
    return $(this.elements.compareWidgetDropdown);
  }

  async missingBaseCriteriaListAnd() {
    return $(this.elements.missingBaseCriteriaListAnd);
  }

  get missingBaseCriteriaListOr() {
    return $(this.elements.missingBaseCriteriaListOr);
  }

  get downloadPdfButton() {
    return $(this.elements.downloadPdf);
  }

  async waitForProcessingSpinnerToDisappear() {
    await browser.waitUntil(async () => !(await $(this.elements.processingSpinner).isDisplayed()));
  }

  async certIdButton(listingId) {
    return this.elements.toggleCertIdButton(listingId);
  }

  async addListingToCms(listingId) {
    await (await this.certIdButton(listingId)).scrollIntoView({ block: 'center', inline: 'center' });
    await (await this.certIdButton(listingId)).click();
  }
}

export default CmsWidgetComponent;
