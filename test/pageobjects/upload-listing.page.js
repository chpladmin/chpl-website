import UploadPage from './upload.page';

class UploadListingPage extends UploadPage {
  constructor() {
    super();
    this.name = 'UploadPage';
    this.elements = {
      ...this.elements,
      root: '#upload-certified-products',
    };
  }

  open() {
    return super.open('administration/upload');
  }

  async uploadListing(filename) {
    await this.chooseUploadFileButton.addValue(await browser.uploadFile(filename));
    await this.uploadButton.click();
    await browser.waitUntil(() => this.uploadResults.isDisplayed());
  }
}

export default UploadListingPage;
