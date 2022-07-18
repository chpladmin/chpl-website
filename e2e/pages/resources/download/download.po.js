class DownloadPage {
  constructor() {
    this.elements = {
      content: 'chpl-resources-download-wrapper-bridge',
    };
  }

  get content() {
    return $(this.elements.content);
  }
}

export default DownloadPage;
