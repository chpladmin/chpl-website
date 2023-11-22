import UploadComponent from '../upload.po';

const path = require('path');

class UploadPiComponent extends UploadComponent {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      root: '#upload-promoting-interoperability-users',
      accurateAsOfDate: '#promoting-interoperability-accurate-as-of',
    };
  }

  get accurateAsOfDate() {
    return $(this.elements.root).$(this.elements.accurateAsOfDate);
  }

  upload(uploadfilePath, accurateAsOf) {
    this.accurateAsOfDate.addValue(accurateAsOf);
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadFileButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    browser.waitUntil(() => this.uploadResults.isDisplayed());
  }
}

export default UploadPiComponent;
