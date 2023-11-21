const path = require('path');

class UploadListingComponent {
  constructor() {
    this.elements = {
      root: '#upload-certified-products',
      title: '.MuiCardHeader-title',
      chooseUploadListing: '#upload-listings',
      uploadButton: '.MuiButton-containedPrimary',
      uploadDone: (filename) => `div#notistack-snackbar*=${filename}`,
    };
  }

  uploadMessage(filename) {
    return $(this.elements.root).$(this.elements.uploadDone(filename));
  }

  get title() {
    return $(this.elements.root).$(this.elements.title);
  }

  get chooseUploadListingButton() {
    return $(this.elements.root).$(this.elements.chooseUploadListing);
  }

  get uploadButton() {
    return $(this.elements.root).$(this.elements.uploadButton);
  }

  uploadListing(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    const toast = this.uploadMessage(uploadfilePath.split('/').pop());
    browser.waitUntil(() => toast.isDisplayed());
  }

  uploadFileAndWaitForListingsToBeProcessed(filename, listingIds, hooks, confirm) {
    this.uploadListing(filename);
    this.uploadMessage(filename.split('/').pop())
      .parentElement()
      .$('button*=Dismiss')
      .click();
    hooks.open('#/administration/confirm/listings');
    browser.waitUntil(() => confirm.isLoaded());
    listingIds.forEach((listingId) => {
      confirm.waitForPendingListingToBecomeClickable(listingId);
    });
  }
}

export default UploadListingComponent;
