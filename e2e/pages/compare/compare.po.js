class ComparePage {
  constructor() {
    this.elements = {
      allCCCQM: '.compare-rowCert.ng-binding',
      criteriaHeader: (number) => `th*=${number}`,
      chplProductNumber: (number) => `td*=${number}`,
    };
  }

  get allCCCQM() {
    $(this.elements.allCCCQM).waitForDisplayed();
    return $$(this.elements.allCCCQM);
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
