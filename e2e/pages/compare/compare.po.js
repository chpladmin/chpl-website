const elements = {
    showAllPossible: '#showAllPossible',
    certificationCriteria: '#toggle-certification-criteria',
    clinicalQualityMeasures: '#toggle-cqms',
    allCCCQM: '.compare-rowCert.ng-binding',
};

class ComparePage {
    constructor () { }

    get showAllCheckbox () {
        return $(elements.showAllPossible);
    }

    get certificationCriterialink () {
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
            this.showAllCheckbox.click();
        }
    }
}

export default ComparePage;
