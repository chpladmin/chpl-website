class AdditionalComponent {
  constructor() {
    this.elements = {
      additionalHeader: '//div[text()="Additional Information"]',
      icsButton: '#toggle-ics-relationship-diagram-button',
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

  get icsButton() {
    return $(this.elements.icsButton);
  }

  get icsRelationshipPanel() {
    return this.icsButton.parentElement().nextElement();
  }

  get compareLink() {
    return $(this.elements.compareLink);
  }

  expandAdditional() {
    this.additionalHeader.parentElement().click();
  }
}

export default AdditionalComponent;
