const uploadElements = {
  root: 'chpl-upload-surveillance',
  chooseUploadSurveillance: '//*[@id="ngf-label-upload-button-surveillance"]/input[@id="ngf-upload-button-surveillance"]',
  uploadButton: '.btn.btn-ai-success',
  surveillanceUploadText: '//*[@id="surveillance-upload"]/div[2]/div/chpl-upload-surveillance/div/div[2]/div',
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

  get surveillanceUploadText () {
    return $(uploadElements.surveillanceUploadText);
  }

  uploadSurveillance (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadSurveillanceButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.waitAndClick();
    browser.waitUntil( () => this.surveillanceUploadText.isDisplayed());
  }

}

export default UploadSurveillanceComponent;
