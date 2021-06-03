const path = require('path');

class UploadSurveillanceComponent {
  constructor() {
    this.elements = {
      root: 'chpl-upload-surveillance-bridge',
      chooseUploadSurveillance: '//input[@id="upload-surveillance"]',
      uploadButton: '.MuiButton-containedPrimary',
    };
  }

  get root() {
    return $(this.elements.root);
  }

  get chooseUploadSurveillanceButton() {
    return $(this.elements.chooseUploadSurveillance);
  }

  get uploadButton() {
    return $(this.elements.root).$(this.elements.uploadButton);
  }

  uploadSurveillance(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadSurveillanceButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.waitAndClick();
  }
}

export default UploadSurveillanceComponent;
