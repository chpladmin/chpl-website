const uploadElements = {
    root: 'chpl-upload-listings',
    title: '.panel-title',
    chooseUploadRwt: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
    uploadButton: '.btn.btn-ai-success',
    fileUploadText: '//chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
};

const path = require('path');

class UploadRwtComponent {
    constructor () { }

    get chooseUploadRwtButton () {
        return $(uploadElements.chooseUploadRwt);
    }

    get uploadButton () {
        return $(uploadElements.root).$(uploadElements.uploadButton);
    }

    get fileUploadText () {
        return $(uploadElements.fileUploadText);
    }

    get title () {
        return $(uploadElements.root).$(uploadElements.title);
    }

    uploadRwt (uploadfilePath) {
        const filePath = path.join(__dirname, uploadfilePath);
        this.chooseUploadRwtButton.addValue(browser.uploadFile(filePath));
        this.uploadButton.waitAndClick();
        browser.waitUntil( () => this.fileUploadText.isDisplayed());
    }

}

export default UploadRwtComponent;
