const path = require('path');

class UploadPage {
  constructor() {
    this.elements = {
      chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
      uploadButton: '.btn.btn-ai-success',
      uploadSuccessfulText: '//chpl-upload-listings/div/div[2]/div',
      useLegacy: '#use-legacy',
    };
  }

  get chooseUploadListingButton() {
    return $(this.elements.chooseUploadListing);
  }

  get uploadButton() {
    return $(this.elements.uploadButton);
  }

  get uploadSuccessfulText() {
    return $(this.elements.uploadSuccessfulText);
  }

  waitForSuccessfulUpload(fileName) {
    browser.waitUntil(() => this.uploadSuccessfulText.getText().includes(fileName));
  }

  uploadListing(uploadfilePath, legacy = false) {
    if (legacy && $('span=Using Modern Upload').isDisplayed()) {
      $(this.elements.useLegacy).click();
    }
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
  }
}

export default UploadPage;
