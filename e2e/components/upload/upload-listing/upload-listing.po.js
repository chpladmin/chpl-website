const path = require('path');

class UploadListingComponent {
  constructor() {
    this.elements = {
      root: '#upload-certified-products',
      chooseUploadFile: '#upload-file-selector',
      uploadButton: '#submit-upload-file',
      snackbar: '#notistack-snackbar',
      //uploadDone: (filename) => `#notistack-snackbar*=${filename}`,
    };
  }

  uploadMessage(filename) {
    return $(this.elements.root).$(this.elements.snackbar);
  }

  get title() {
    return $(this.elements.root).$$('div')[0];
  }

  get chooseUploadListingButton() {
    return $(this.elements.root).$(this.elements.chooseUploadFile);
  }

  get uploadButton() {
    return $(this.elements.root).$(this.elements.uploadButton);
  }

  get uploadResults() {
    return $(this.elements.snackbar);
  }

  clearResults() {
    $(this.elements.snackbar).parentElement().$('button').click();
  }

  uploadListing(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    const toast = this.uploadMessage(uploadfilePath.split('/').pop());
    browser.waitUntil(() => this.uploadResults.isDisplayed());
  }

  uploadFileAndWaitForListingsToBeProcessed(filename, listingIds, hooks, confirm) {
    this.uploadListing(filename);
    this.clearResults();
    /*
    this.uploadMessage(filename.split('/').pop())
      .parentElement()
      .$('button*=Dismiss')
      .click();
      */
    hooks.open('#/administration/confirm/listings');
    browser.waitUntil(() => confirm.isLoaded());
    listingIds.forEach((listingId) => {
      confirm.waitForPendingListingToBecomeClickable(listingId);
    });
  }
}

export default UploadListingComponent;
