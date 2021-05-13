const uploadElements = {
  root: 'chpl-upload-surveillance-bridge',
  chooseUploadSurveillance: '//input[@id="upload-surveillance"]',
  uploadButton: '.MuiButton-containedPrimary',
};

const path = require('path');

class UploadSurveillanceComponent {
  constructor () { }

  get chooseUploadSurveillanceButton () {
    return $(uploadElements.chooseUploadSurveillance);
  }

  get uploadButton () {
    return $(uploadElements.root).$(uploadElements.uploadButton);
  }

  uploadSurveillance (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadSurveillanceButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.waitAndClick();
  }

}

export default UploadSurveillanceComponent;
