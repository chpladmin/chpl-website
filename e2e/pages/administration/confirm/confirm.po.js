const confirmElements = {
    inspectNext: '#inspect-next',
    inspectConfirm: '#inspect-confirm',
    yesConfirmation: '//button[text()="Yes"]',
    rejectButton: '//table[@id="pending-listings-table"]/tfoot/tr/th/button',
}

class ConfirmPage {
    constructor () { }

    get inspectNextButton () {
        return $(confirmElements.inspectNext);
    }

    get inspectConfirmButton () {
        return $(confirmElements.inspectConfirm);
    }

    get yesConfirmation () {
        return $(confirmElements.yesConfirmation);
    }

    get rejectButton () {
        return $(confirmElements.rejectButton);
    }

    gotoConfirmListingPage (inspectListingId ) {
        $('//button[@id="pending-listing-inspect-' + inspectListingId + '"]').waitAndClick();
        this.inspectNextButton.waitAndClick();
        this.inspectNextButton.waitAndClick();
        this.inspectNextButton.waitAndClick();
        if (this.inspectConfirmButton.isDisplayed()) {
            this.inspectConfirmButton.waitForDisplayed();
        } else {
            this.inspectNextButton.waitAndClick();
            this.inspectConfirmButton.waitForDisplayed();
        }
    }

    findListingtoReject (chplId) {
        return $('//td[text()="' + chplId + '"]');
    }

    rejectListing (chplId) {
        $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input').waitAndClick();
        if (this.rejectButton.isClickable()) {
            this.rejectButton.waitAndClick();
        } else {
            $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input').waitAndClick();
            this.rejectButton.waitAndClick();
        }
        this.yesConfirmation.waitAndClick();
    }
}

export default ConfirmPage;
