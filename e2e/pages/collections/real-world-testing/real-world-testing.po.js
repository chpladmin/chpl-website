import CollectionPage from '../collection.po';

class RealWorldTestingPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      downloadAllRwtButton: 'button*=Download All',
    };
  }

  get downloadAllRwtButton() {
    return $(this.elements.downloadAllRwtButton);
  }
}

export default RealWorldTestingPage;
