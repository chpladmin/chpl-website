const elements = {
  showAllPossible: '#show-all-possible',
  certificationCriteria: '#toggle-certification-criteria',
  clinicalQualityMeasures: '#toggle-cqms',
  allCCCQM: '.compare-rowCert.ng-binding',
  toggleCriteriaButton: '#toggle-certification-criteria',
};

class ComparePage {
  constructor() { }

  get showAllCheckbox() {
    return $(elements.showAllPossible);
  }

  get certificationCriteriaLink() {
    return $(elements.certificationCriteria);
  }

  get clinicalQualityMeasuresLink() {
    return $(elements.clinicalQualityMeasures);
  }

  get allCCCQM() {
    $(elements.allCCCQM).waitForDisplayed();
    return $$(elements.allCCCQM);
  }

  get toggleCriteriaButton() {
    return $(elements.toggleCriteriaButton);
  }

  checkShowAllCheckbox() {
    if (!this.showAllCheckbox.isSelected()) {
      this.showAllCheckbox.click();
    }
  }

  getCellWithCriteriaNumber(criteriaNumber) {
    return $(`th*=${criteriaNumber}`);
  }
}

export default ComparePage;
