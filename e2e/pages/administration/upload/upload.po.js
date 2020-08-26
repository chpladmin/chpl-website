// No need for this now, update next time

const uploadElements = {
    chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
    uploadButton: '.btn.btn-ai-success',
    listingUploadText: '//chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
};
const path = require('path');

class UploadPage {
    constructor () { }

    get chooseUploadListingButton () {
        return $(uploadElements.chooseUploadListing);
    }

    get uploadButton () {
        return $(uploadElements.uploadButton);
    }

    get uploadSuccessfulText () {
        return $(uploadElements.uploadSuccessfulText);
    }

    get listingUploadText () {
        return $(uploadElements.listingUploadText);
    }

    waitForSuccessfulUpload () {
        browser.waitUntil( () => this.uploadSuccessfulText.isDisplayed());
    }

    uploadListing (uploadfilePath) {
        const filePath = path.join(__dirname, uploadfilePath);
        this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
        this.uploadButton.waitAndClick();
        browser.waitUntil( () => this.listingUploadText.isDisplayed());
    }

}

export default UploadPage;
