const path = require('path');

class UploadRwtComponent {
  constructor() {
    this.uploadElements = {
      root: '#upload-real-world-testing',
      title: '.panel-title',
      chooseUploadRwt: '#upload-file-selector',
      uploadButton: '#submit-upload-file',
      snackbar: '#notistack-snackbar',
    };
  }

  get chooseUploadRwtButton() {
    return $(this.uploadElements.chooseUploadRwt);
  }

  get uploadButton() {
    return $(this.uploadElements.root).$(this.uploadElements.uploadButton);
  }

  get fileUploadText() {
    return $(this.uploadElements.snackbar);
  }

  get title() {
    return $(this.uploadElements.root).$(this.uploadElements.title);
  }

  uploadRwt(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadRwtButton.addValue(browser.uploadFile(filePath));
    this.uploadButton.click();
    browser.waitUntil(() => this.fileUploadText.isDisplayed());
  }
}

export default UploadRwtComponent;
