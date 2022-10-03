import CollectionPage from '../collection.po';

class BannedDevelopersPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Developers Under Certification Ban',
    };
  }
}

export default BannedDevelopersPage;
