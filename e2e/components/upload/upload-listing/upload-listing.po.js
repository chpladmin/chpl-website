import UploadComponent from '../upload.po';

const path = require('path');

class UploadListingComponent extends UploadComponent {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      root: '#upload-certified-products',
    };
  }

  uploadListing(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadFileButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    browser.waitUntil(() => this.uploadResults.isDisplayed());
  }

  uploadFileAndWaitForListingsToBeProcessed(filename, listingIds, hooks, confirm) {
    this.uploadListing(filename);
    this.clearResults();
    hooks.open('#/administration/confirm/listings');
    browser.waitUntil(() => confirm.isLoaded());
    listingIds.forEach((listingId) => {
      confirm.waitForPendingListingToBecomeClickable(listingId);
    });
  }
}

export default UploadListingComponent;
