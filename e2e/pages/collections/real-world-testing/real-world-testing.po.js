import CollectionPage from '../collection.po';

class RealWorldTestingPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h2=Real World Testing',
      downloadRealWorldTesting: '#download-real-world-testing',
    };
  }

  get bodyText() {
    return $(this.elements.header).parentElement();
  }

  get downloadRealWorldTesting() {
    return $(this.elements.downloadRealWorldTesting);
  }
}

export default RealWorldTestingPage;
