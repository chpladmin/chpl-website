class AdditionalComponent {
  constructor() {
    this.elements = {
      additionalHeader: '//div[text()="Additional Information"]',
      icsButton: '//button[text()="View ICS Relationships"]',
      icsRelationshipModal: '#modalLabel',
      compareButton: '//button[text()="Compare all Products"]',
      testResultsSummary: '#panel-additional-information-test-results-summary',
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

  expandAdditional() {
    $('//div[text()="Additional Information"]/following-sibling::div').scrollAndClick();
  }
}

export default AdditionalComponent;
