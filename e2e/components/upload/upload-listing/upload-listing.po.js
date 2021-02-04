const uploadElements = {
  root: 'chpl-upload-listings',
  title: '.panel-title',
  chooseUploadListing: '//*[@id="ngf-label-upload-button-listing"]/input[@id="ngf-upload-button-listing"]',
  uploadButton: '.btn.btn-ai-success',
  listingUploadText: '//chpl-upload/div/div/chpl-upload-listings/div/div[2]/div',
  chooseUploadListingBeta: '//*[@id="ngf-label-upload-button-listing-beta"]/input[@id="ngf-upload-button-listing-beta"]',
  uploadBetaButton: '#upload-button-listing-beta',
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

  get chooseUploadListingBetaButton () {
    return $(uploadElements.chooseUploadListingBeta);
  }

  get uploadBetaButton () {
    return $(uploadElements.uploadBetaButton);
  }

  uploadListingBeta (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadListingBetaButton.addValue(browser.uploadFile(filePath));
    $$(uploadElements.root)[1].$(uploadElements.uploadButton).click();
  }

  uploadListing (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.waitAndClick();
    browser.waitUntil( () => this.listingUploadText.isDisplayed());
  }

}

export default UploadListingComponent;
