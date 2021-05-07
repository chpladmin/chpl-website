const uploadElements = {
  root: 'chpl-upload-meaningful-use-bridge',
  chooseUploadMuu: '//input[@id="upload-meaningful-use"]',
  uploadButton: '.MuiButton-containedPrimary',
  accurateAsOfDate: '#accurate-as-of',
};

const path = require('path');

class UploadMuuComponent {
  constructor () { }

  get chooseUploadMuuButton () {
    return $(uploadElements.chooseUploadMuu);
  }

  get uploadButton () {
    return $(uploadElements.root).$(uploadElements.uploadButton);
  }

  get accurateAsOfDate () {
    return $(uploadElements.accurateAsOfDate);
  }

  uploadMuu (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadMuuButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.scrollAndClick();
  }

}

export default UploadMuuComponent;
