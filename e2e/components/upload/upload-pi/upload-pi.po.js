const path = require('path');

class UploadPiComponent {
  constructor() {
    this.elements = {
      uploadButton: '//span[text()="Upload"]',
      accurateAsOfDate: '#promoting-interoperability-accurate-as-of',
      chooseUploadPi: '//input[@id="upload-promoting-interoperability"]',
    };
  }

  get chooseUploadButton() {
    return $(this.elements.chooseUploadPi);
  }

  get uploadButton() {
    return $(this.elements.uploadButton);
  }

  get accurateAsOfDate() {
    return $(this.elements.accurateAsOfDate);
  }

  upload(uploadfilePath, accurateAsOf) {
    this.accurateAsOfDate.addValue(accurateAsOf);
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
  }
}

export default UploadPiComponent;
