import UploadComponent from '../upload.po';

const path = require('path');

class UploadApiDocumentationComponent extends UploadComponent {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      root: '#upload-api-documentation',
    };
  }

  uploadAPIDocFile(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadFileButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.scrollIntoView();
    this.uploadButton.click();
    browser.waitUntil(() => this.uploadResults.isDisplayed());
  }
}

export default UploadApiDocumentationComponent;
