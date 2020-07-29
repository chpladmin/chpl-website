const uploadElements = {
    chooseUploadListing: '//*[@id="ngf-upload-button-listing"]',
    uploadBtn: '//*[@id="main-content"]/div/ui-view/chpl-upload/div/div/chpl-upload-listings/div/div[2]/form/div/div[4]/button[1]',
    uploadSuccessfulText: '//*[@id="main-content"]/div/ui-view/chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
}

const uploadAsserts = {
    expectedUploadText: 'was uploaded successfully. 1 pending products are ready for confirmation.',
}

class UploadPage {
    constructor () { }

    get ChooseUploadListingBtn () {
        return $(uploadElements.chooseUploadListing);
    }

    get uploadBtn () {
        return $(uploadElements.uploadBtn);
    }

    get uploadSuccessfulText () {
        return $(uploadElements.uploadSuccessfulText);
    }

    get expectedUploadSuccessfulText () {
        return uploadAsserts.expectedUploadText;
    }

    uploadListing (uploadfilePath) {
        const path = require('path');
        const filePath = path.join(__dirname, uploadfilePath);
        const remoteFilePath = browser.uploadFile(filePath);
        this.ChooseUploadListingBtn.addValue(remoteFilePath);
        this.uploadBtn.waitAndClick();
    }
}

export default UploadPage;
