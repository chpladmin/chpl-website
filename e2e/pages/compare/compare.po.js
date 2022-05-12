class ComparePage {
  constructor() {
    this.elements = {
      showAllPossible: '#show-all-possible',
      certificationCriteria: '#toggle-certification-criteria',
      clinicalQualityMeasures: '#toggle-cqms',
      allCCCQM: '.compare-rowCert.ng-binding',
      toggleCriteriaButton: '#toggle-certification-criteria',
      criteriaHeader: (number) => `th*=${number}`,
      chplProductNumber: (number) => `td*=${number}`,
    };
  }

  get showAllCheckbox() {
    return $(this.elements.showAllPossible);
  }

  get certificationCriteriaLink() {
    return $(this.elements.certificationCriteria);
  }

  get clinicalQualityMeasuresLink() {
    return $(this.elements.clinicalQualityMeasures);
  }

  get allCCCQM() {
    $(this.elements.allCCCQM).waitForDisplayed();
    return $$(this.elements.allCCCQM);
  }

  get toggleCriteriaButton() {
    return $(this.elements.toggleCriteriaButton);
  }

  checkShowAllCheckbox() {
    if (!this.showAllCheckbox.isSelected()) {
      this.showAllCheckbox.click();
    }
  }

  getCellWithCriteriaNumber(criteriaNumber) {
    return $(this.elements.criteriaHeader(criteriaNumber));
  }

  isListingLoaded(chplProductNumber) {
    return $(this.elements.chplProductNumber(chplProductNumber)).isDisplayed();
  }

  findIndex(chplProductNumber) {
    return $(this.elements.chplProductNumber(chplProductNumber))
      .parentElement()
      .$$('td')
      .findIndex((ele) => ele.getText() === chplProductNumber);
  }

  getDecertificationDate(chplProductNumber) {
    return $('table')
      .$('tbody')
      .$$('tr')
      .find((row) => row.getText().includes('Inactive/Decertified Date'))
      .$$('td')[this.findIndex(chplProductNumber)]
      .getText();
  }
}

export default ComparePage;
