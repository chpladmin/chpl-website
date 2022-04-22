const path = require('path');

class UploadListingComponent {
  constructor() {
    this.elements = {
      title: '.panel-title',
      listingUploadText: '//chpl-upload-listings/div/div[2]/div',
      chooseUploadListing: '#upload-listings',
      uploadButton: '.MuiButton-containedPrimary',
      useLegacy: '#use-legacy',
      usingModern: 'span=Using Modern Upload',
      uploadDone: (filename) => `div#notistack-snackbar*=${filename}`,
    };
  }

  get listingUploadText() {
    return $(this.elements.listingUploadText);
  }

  get title() {
    return $(this.elements.title);
  }

  get chooseUploadListingButton() {
    return $(this.elements.chooseUploadListing);
  }

  get uploadButton() {
    return $(this.elements.uploadButton);
  }

  uploadListing(uploadfilePath, legacy = false) {
    if (legacy && $(this.elements.usingModern).isDisplayed()) {
      $(this.elements.useLegacy).click();
    }
    const filePath = path.join(__dirname, uploadfilePath);
    const filename = uploadfilePath.split('/').pop();
    this.chooseUploadListingButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    const toast = $(this.elements.uploadDone(filename));
    browser.waitUntil(() => toast.isDisplayed());
  }

  uploadFileAndWaitForListingsToBeProcessed(filename, listingIds, hooks, confirm) {
    this.uploadListing(filename);
    $(this.elements.uploadDone(filename.split('/').pop())).parentElement().$('button*=Dismiss').click();
    hooks.open('#/administration/confirm/listings');
    browser.waitUntil(() => confirm.isLoaded());
    listingIds.forEach((listingId) => {
      confirm.waitForPendingListingToBecomeClickable(listingId);
    });
  }
}

export default UploadListingComponent;
