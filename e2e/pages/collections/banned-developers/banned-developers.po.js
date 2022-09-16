import CollectionPage from '../collection.async.po';

class BannedDevelopersPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h1=Developers Under Certification Ban',
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
}

export default BannedDevelopersPage;
