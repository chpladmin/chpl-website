const uploadElements = {
    chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
    uploadButton: '.btn.btn-ai-success',
    listingUploadText: '//chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
    chooseUploadAPIDocumentation: '//*[@id="ngf-label-upload-button-api"]/input[@id="ngf-upload-button-api"]',
    apiDocUploadText: '//chpl-upload-api-documentation/div/div[2]/div',
}
const path = require('path');

class UploadPage {
    constructor () { }

    get chooseUploadListingButton () {
        return $(uploadElements.chooseUploadListing);
    }

    get uploadButton () {
        return $(uploadElements.uploadButton);
    }

    get listingUploadText () {
        return $(uploadElements.listingUploadText);
    }

    get chooseUploadAPIDocumentation () {
        return $(uploadElements.chooseUploadAPIDocumentation);
    }

    get apiDocUploadText () {
        return $(uploadElements.apiDocUploadText);
    }

    uploadListing (uploadfilePath) {
        const filePath = path.join(__dirname, uploadfilePath);
        this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
        this.uploadButton.waitAndClick();
        browser.waitUntil( () => this.listingUploadText.isDisplayed())
    }

    uploadAPIDocFile (uploadfilePath) {
        const filePath = path.join(__dirname, uploadfilePath);
        this.chooseUploadAPIDocumentation.addValue(browser.uploadFile(filePath));
        this.uploadButton.scrollAndClick();
        browser.waitUntil( () => this.apiDocUploadText.isDisplayed());
    }
}

export default UploadPage;
