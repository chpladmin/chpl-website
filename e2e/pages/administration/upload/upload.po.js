const config = require('../../../config/mainConfig');
const uploadElements = {
    chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
    uploadButton: '//*[@id="main-content"]/div/ui-view/chpl-upload/div/div/chpl-upload-listings/div/div[2]/form/div/div[4]/button[1]',
    uploadSuccessfulText: '//*[@id="main-content"]/div/ui-view/chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
}

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

    uploadListing (uploadfilePath) {
        const path = require('path');
        const filePath = path.join(__dirname, uploadfilePath);
        const remoteFilePath = browser.uploadFile(filePath);
        this.chooseUploadListingButton.addValue(remoteFilePath);
        this.uploadButton.waitAndClick();
    }

    waitForSuccessfulUpload () {
        browser.waitUntil( () => this.uploadSuccessfulText.isDisplayed() ,
            {
                timeout: config.longTimeout,
            }
        );
    }
}

export default UploadPage;
