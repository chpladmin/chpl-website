class ConfirmPage {
    constructor () { }

    get inspectNextBtn () {
        return $('#inspect-next');
    }

    get inspectConfirmBtn () {
        return $('#inspect-confirm');
    }

    get editcertifiedProduct () {
        return $('#inspect-edit');
    }

    get testProcedureName () {
        return $('//*[@id="testProcedures "]');
    }

    get allTestProcedureVersion () {
        return $$('*[id^="testProcedures-additional-input"]');
    }

    get testToolsName () {
        return $('//*[@id="testTools "]');
    }

    get alltestToolsVersion () {
        return $$('*[id^="testTools-additional-input"]');
    }

    get testDataName () {
        return $('//*[@id="testData "]');
    }

    get alltestDataVersion () {
        return $$('*[id^="testData-additional-input"]');
    }

    get testFunctionalityName () {
        return $('*[id="testFunctionality "]');
    }

    get saveCertifiedProduct () {
        return $('button=Save Certification Criteria');
    }

    get closeListingEditBtn () {
        return $('button.close.pull-right.ng-isolate-scope');
    }

    get yesConfirmation () {
        return $('//button[text()="Yes"]');
    }

    get rejectBtn () {
        return $('//table[@id="pending-listings-table"]/tfoot/tr/th/button');
    }

    gotoConfirmListingPg (inspectListingId ) {
        $('//button[@id="pending-listing-inspect-' + inspectListingId + '"]').waitAndClick();
        this.inspectNextBtn.waitAndClick();
        this.inspectNextBtn.waitAndClick();
        this.inspectNextBtn.waitAndClick();
        if (this.inspectConfirmBtn.isDisplayed()) {
            this.inspectConfirmBtn.waitForDisplayed();
        }
        else {
            this.inspectNextBtn.waitAndClick();
            this.inspectConfirmBtn.waitForDisplayed();
        }
    }

    rejectListing (chplId) {
        $('//td[text()="' + chplId + '"]/parent::tr/td[8]/input').waitAndClick();
        this.rejectBtn.click();
        this.yesConfirmation.click();
    }
}

export default ConfirmPage;
