class UploadComponent {
  constructor() {
    this.elements = {
      root: undefined,
      chooseUploadFile: '#upload-file-selector',
      uploadButton: '#submit-upload-file',
      snackbar: '#notistack-snackbar',
    };
  }

  uploadMessage() {
    return $(this.elements.root).$(this.elements.snackbar);
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

  clearResults() {
    $(this.elements.snackbar).parentElement().$('button').click();
  }
}

export default UploadComponent;
