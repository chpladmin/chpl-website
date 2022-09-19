import CollectionPage from '../collection.po';

class RealWorldTestingPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h1=Real World Testing',
      downloadRealWorldTesting: '#download-real-world-testing',
    };
  }

  async getBodyText() {
    return (await
            (await
             (await
              $(this.elements.header)
             ).parentElement()
            ).nextElement()
           ).getText();
  }

  async getDownloadRealWorldTesting() {
    return $(this.elements.downloadApiDocumentation);
  }
}

export default RealWorldTestingPage;
