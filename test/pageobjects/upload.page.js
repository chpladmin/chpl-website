import Page from './page.es6';

class UploadPage extends Page {
  constructor() {
    super();
    this.name = 'UploadPage';
    this.elements = {
      ...this.elements,
      root: undefined,
      chooseUploadFile: '#upload-file-selector',
      uploadButton: '#submit-upload-file',
      snackbar: '#notistack-snackbar',
    };
  }

  get title() {
    return $(this.elements.root).$$('div')[0];
  }

  get chooseUploadFileButton() {
    return $(this.elements.root).$(this.elements.chooseUploadFile);
  }

  get uploadButton() {
    return $(this.elements.root).$(this.elements.uploadButton);
  }

  get uploadResults() {
    return $(this.elements.snackbar);
  }
}

export default UploadPage;
