const elements = {
  showAllPossible: '#show-all-possible',
  certificationCriteria: '#toggle-certification-criteria',
  clinicalQualityMeasures: '#toggle-cqms',
  allCCCQM: '.compare-rowCert.ng-binding',
};

class ComparePage {
  constructor () { }

  get showAllCheckbox () {
    return $(elements.showAllPossible);
  }

  get certificationCriteriaLink () {
    return $(elements.certificationCriteria);
  }

  get clinicalQualityMeasuresLink () {
    return $(elements.clinicalQualityMeasures);
  }

  get allCCCQM () {
    $(elements.allCCCQM).waitForDisplayed();
    return $$(elements.allCCCQM);
  }

  checkShowAllCheckbox () {
    if (!this.showAllCheckbox.isSelected()) {
      this.showAllCheckbox.scrollAndClick();
    }
  }
}

export default ComparePage;
