const uploadElements = {
  root: 'chpl-upload-meaningful-use',
  title: '.panel-title',
  chooseUploadMuu: '//*[@id="ngf-label-upload-button-muu"]/input[@id="ngf-upload-button-muu"]',
  uploadButton: '.btn.btn-ai-success',
  date: '#new-muu-date',
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

  get fileUploadText () {
    return $(uploadElements.root).$('div').$('div.panel-body').$('div');
  }

  get title () {
    return $(uploadElements.root).$(uploadElements.title);
  }

  get date () {
    return $(uploadElements.root).$(uploadElements.date);
  }

  uploadMuu (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadMuuButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.scrollAndClick();
    browser.waitUntil( () => this.fileUploadText.isDisplayed());
  }

}

export default UploadMuuComponent;
