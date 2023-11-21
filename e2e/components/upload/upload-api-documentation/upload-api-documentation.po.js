const path = require('path');

class UploadApiDocumentationComponent {
  constructor() {
    this.uploadElements = {
      root: '#upload-api-documentation',
      chooseUploadAPIDocumentation: '#upload-file-selector',
      uploadMessages: '.upload-messages',
      uploadButton: '#submit-upload-file',
      uploadMessagesText: 'div.ng-binding.ng-scope',
      snackbar: '#notistack-snackbar',
    };
  }

  get uploadButton() {
    return $(this.uploadElements.root).$(this.uploadElements.uploadButton);
  }

  get chooseUploadAPIDocumentation() {
    return $(this.uploadElements.root).$(this.uploadElements.chooseUploadAPIDocumentation);
  }

  get apiDocUploadText() {
    return $(this.uploadElements.snackbar);
  }

  get title() {
    return $(this.uploadElements.root).$$('div')[0];
  }

  uploadAPIDocFile(uploadfilePath) {
    const filePath = path.join(__dirname, uploadfilePath);
    this.chooseUploadAPIDocumentation.addValue(browser.uploadFile(filePath));
    this.uploadButton.scrollIntoView();
    this.uploadButton.click();
    browser.waitUntil(() => this.apiDocUploadText.isDisplayed());
  }
}

export default UploadApiDocumentationComponent;
