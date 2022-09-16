import CollectionPage from '../collection.po';

class BannedDevelopersPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h1=Developers Under Certification Ban',
      downloadRealWorldTesting: '#download-real-world-testing',
    };
  }

  get bodyText() {
    return $(this.elements.header).parentElement().nextElement();
  }
}

export default BannedDevelopersPage;
