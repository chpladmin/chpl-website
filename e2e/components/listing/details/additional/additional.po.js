class AdditionalComponent {
  constructor() {
    this.elements = {
      additionalHeader: '//div[text()="Additional Information"]',
      icsButton: '//button[text()="View ICS Relationships"]',
      icsRelationshipModal: '#modalLabel',
      compareButton: '//button[text()="Compare all Products"]',
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

  get icsButton() {
    return $(this.elements.icsButton);
  }

  get icsRelationshipModal() {
    return $(this.elements.icsRelationshipModal);
  }

  get compareButton() {
    return $(this.elements.compareButton);
  }

  closeModal() {
    $(this.elements.modalHeader).$('//button').scrollAndClick();
  }

  expandAdditional() {
    this.additionalHeader.parentElement().scrollAndClick();
  }
}

export default AdditionalComponent;
