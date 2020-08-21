const elements = {
    showAllPossible: '#showAllPossible',
    certificationCriteria: '//table/tbody/tr[9]/th/a',
    clinicalQualityMeasures: '//table/tbody/tr[88]/th/a',
    allCCCQM: '.compare-rowCert.ng-binding',
}

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
