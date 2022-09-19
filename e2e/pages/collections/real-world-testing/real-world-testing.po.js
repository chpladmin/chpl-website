import CollectionPage from '../collection.po';

class RealWorldTestingPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h1=Real World Testing',
      downloadRealWorldTesting: '#download-real-world-testing',
    };
  }

  /* eslint-disable indent */
  async getBodyText() {
    return (await
            (await
             (await
              $(this.elements.header)
             ).parentElement()
            ).nextElement()
           ).getText();
  }
  /* eslint-enable indent */

  async getDownloadRealWorldTesting() {
    return $(this.elements.downloadRealWorldTesting);
  }
}

export default RealWorldTestingPage;
