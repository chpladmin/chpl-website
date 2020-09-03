const uploadElements = {
    root: 'chpl-upload-listings',
    title: '.panel-title',
    chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
    uploadButton: '.btn.btn-ai-success',
    listingUploadText: '//chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
};

const path = require('path');

class UploadListingComponent {
    constructor () { }

    get chooseUploadListingButton () {
        return $(uploadElements.chooseUploadListing);
    }

    get uploadButton () {
        return $(uploadElements.root).$(uploadElements.uploadButton);
    }

    get listingUploadText () {
        return $(uploadElements.listingUploadText);
    }

    get title () {
        return $(uploadElements.root).$(uploadElements.title);
    }

    uploadListing (uploadfilePath) {
        const filePath = path.join(__dirname, uploadfilePath);
        this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
        this.uploadButton.waitAndClick();
        browser.waitUntil( () => this.listingUploadText.isDisplayed());
    }

}

export default UploadListingComponent;
