import UploadComponent from '../upload.po';

const path = require('path');

class UploadRwtComponent extends UploadComponent {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      root: '#upload-real-world-testing',
    };
  }

  uploadRwt(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadFileButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    browser.waitUntil(() => this.uploadResults.isDisplayed());
  }
}

export default UploadRwtComponent;
