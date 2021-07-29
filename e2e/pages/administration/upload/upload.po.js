// No need for this now, update next time

const uploadElements = {
  chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
  uploadButton: '.btn.btn-ai-success',
  uploadSuccessfulText: '//chpl-upload-listings/div/div[2]/div',
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

  waitForSuccessfulUpload (fileName) {
    browser.waitUntil( () => this.uploadSuccessfulText.getText().includes(fileName));
  }

  uploadListing (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.waitAndClick();
  }

}

export default UploadPage;
