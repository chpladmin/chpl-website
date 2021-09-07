const path = require('path');

class UploadMuuPiComponent {
  constructor() {
    this.elements = {
      root: 'chpl-upload-meaningful-use-bridge',
      chooseUploadMuu: '//input[@id="upload-meaningful-use"]',
      uploadButton: '//span[text()="Upload"]',
      accurateAsOfDate: '#accurate-as-of',
      chooseUploadPi: '//input[@id="upload-promoting-interoperability"]',
    };
  }

  get chooseUploadMuuButton() {
    return $(this.elements.chooseUploadMuu);
  }

  get chooseUploadPiButton() {
    return $(this.elements.chooseUploadPi);
  }

  get uploadButton() {
    return $(this.elements.uploadButton);
  }

  get accurateAsOfDate() {
    return $(this.elements.accurateAsOfDate);
  }

  uploadMuu(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadMuuButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
  }

  uploadPi(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadPiButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
  }
}

export default UploadMuuPiComponent;
