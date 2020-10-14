const uploadElements = {
    root: 'chpl-upload-real-world-testing',
    title: '.panel-title',
    chooseUploadRwt: '//*[@id="ngf-label-upload-button-rwt"]/input[@id="ngf-upload-button-rwt"]',
    uploadButton: '.btn.btn-ai-success',
    fileUploadText: '//*[@id="main-content"]/div/ui-view/chpl-upload/div/div/chpl-upload-real-world-testing/div/div[2]/div',
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
