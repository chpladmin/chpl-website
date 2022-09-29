import CollectionPage from '../collection.po';

class RealWorldTestingPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Real World Testing',
      downloadRealWorldTesting: '#download-real-world-testing',
    };
  }

  async getDownloadRealWorldTesting() {
    return $(this.elements.downloadRealWorldTesting);
  }
}

export default RealWorldTestingPage;
