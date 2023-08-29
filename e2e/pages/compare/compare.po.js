class ComparePage {
  constructor() {
    this.elements = {
      criteriaRow: (id) => `#criterion-${id}`,
      chplProductNumber: (number) => `td*=${number}`,
    };
  }

  getCellWithCriteriaId(id) {
    return $(this.elements.criteriaRow(id)).$$('td')[0];
  }

  isListingLoaded(chplProductNumber) {
    return $(this.elements.chplProductNumber(chplProductNumber)).isDisplayed();
  }

  findColumnIndex(chplProductNumber) {
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
      .$$('td')[this.findColumnIndex(chplProductNumber)]
      .getText();
  }
}

export default ComparePage;
