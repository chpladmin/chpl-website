class DownloadPage {
  constructor() {
    this.elements = {
      downloadBridge: 'chpl-resources-download-bridge',
      download: '#download-select',
      downloadDefinitionFileButton: '#download-chpl-definition-button',
      downloadDataFileButton: '#download-chpl-data-button',
    };
  }

  get downloadPage() {
    return $(this.elements.downloadBridge);
  }

  selectFile(file) {
    $(this.elements.download).click();
    browser.pause(1000);
    $(`li[data-value="${file}"]`).click();
    browser.pause(1000);
  }

  downloadDataFile(file) {
    this.selectFile(file);
    $(this.elements.downloadDataFileButton).click();
  }

  downloadDefinitionFile(file) {
    this.selectFile(file);
    $(this.elements.downloadDefinitionFileButton).click();
  }
}

export default DownloadPage;
