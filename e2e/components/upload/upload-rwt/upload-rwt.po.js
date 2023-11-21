const uploadElements = {
  root: '#upload-real-world-testing',
  title: '.panel-title',
  chooseUploadRwt: '//*[@id="ngf-label-upload-button-rwt"]/input[@id="ngf-upload-button-rwt"]',
  uploadButton: '.btn.btn-ai-success',
};

const path = require('path');

class UploadRwtComponent {
  constructor () { }

  get chooseUploadRwtButton () {
    return $(uploadElements.chooseUploadRwt);
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

  uploadRwt (uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadRwtButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    browser.waitUntil( () => this.fileUploadText.isDisplayed());
  }

}

export default UploadRwtComponent;
