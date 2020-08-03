class ConfirmPage {
    constructor () { }

    get inspectNextButton () {
        return $('#inspect-next');
    }

    get inspectConfirmButton () {
        return $('#inspect-confirm');
    }

    get yesConfirmation () {
        return $('//button[text()="Yes"]');
    }

    get rejectButton () {
        return $('//table[@id="pending-listings-table"]/tfoot/tr/th/button');
    }

    gotoConfirmListingPg (inspectListingId ) {
        $('//button[@id="pending-listing-inspect-' + inspectListingId + '"]').waitAndClick();
        this.inspectNextButton.waitAndClick();
        this.inspectNextButton.waitAndClick();
        this.inspectNextButton.waitAndClick();
        if (this.inspectConfirmButton.isDisplayed()) {
            this.inspectConfirmButton.waitForDisplayed();
        }
        else {
            this.inspectNextButton.waitAndClick();
            this.inspectConfirmButton.waitForDisplayed();
        }
    }

    findListingtoReject (chplId) {
        return $('//td[text()="' + chplId + '"]');
    }

    rejectListing (chplId) {
        $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input').waitAndClick();
        this.rejectButton.waitAndClick();
        this.yesConfirmation.waitAndClick();
    }
}

export default ConfirmPage;
