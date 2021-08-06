const downloadElements = {
  downloadBridge: 'chpl-resources-download-bridge',
  download: '#download-select',
  downloadDefinitionFileButton: '#download-chpl-definition-button',
  downloadDataFileButton: '#download-chpl-data-button',
};

class DownloadPage {
  constructor () { }

  get downloadPage () {
    return $(downloadElements.downloadBridge);
  }

  selectFile(file) {
    $(downloadElements.download).click();
    browser.pause(1000);
    $(`li[data-value="${file}"]`).click();
    browser.pause(1000);
  }

  downloadDataFile(file) {
    this.selectFile(file);
    $(downloadElements.downloadDefinitionFileButton).click();
  }

  downloadDefinitionFile(file) {
    this.selectFile(file);
    $(downloadElements.downloadDefinitionFileButton).click();
  }
}

export default DownloadPage;
