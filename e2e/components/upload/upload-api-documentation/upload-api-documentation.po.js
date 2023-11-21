const uploadElements = {
  root: '#upload-api-documentation',
  chooseUploadAPIDocumentation: '//*[@id="ngf-label-upload-button-api"]/input[@id="ngf-upload-button-api"]',
  uploadMessages: '.upload-messages',
  uploadButton: '.btn.btn-ai-success',
  uploadMessagesText: 'div.ng-binding.ng-scope',
};

const path = require('path');

class UploadApiDocumentationComponent {
  constructor() { }

  get uploadButton() {
    return $(uploadElements.root).$(uploadElements.uploadButton);
  }

  get chooseUploadAPIDocumentation() {
    return $(uploadElements.chooseUploadAPIDocumentation);
  }

  get apiDocUploadText() {
    return $(uploadElements.root).$(uploadElements.uploadMessages).$(uploadElements.uploadMessagesText);
  }

  get title() {
    return $(uploadElements.root).$$('div')[0];
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
