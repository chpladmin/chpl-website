class AdditionalComponent {
  constructor() {
    this.elements = {
      additionalHeader: '//div[text()="Additional Information"]',
      additionalInformationPanel: '#panel-additional-information',
      compareLink: 'a=Compare all Certified Products',
      testResultsSummary: '#panel-additional-information-test-results-summary',
      modalHeader: '.modal-header',
    };
  }

  get additionalHeader() {
    return $(this.elements.additionalHeader);
  }

  get testResultsSummary() {
    return $(this.elements.testResultsSummary);
  }

  get additionalInformationPanel() {
    return $(this.elements.additionalInformationPanel);
  }

  get compareLink() {
    return $(this.elements.compareLink);
  }

  expandAdditional() {
    this.additionalHeader.parentElement().click();
  }
}

export default AdditionalComponent;
