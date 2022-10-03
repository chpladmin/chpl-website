import CollectionPage from '../collection.po';

class ApiDocumentationPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=API Information for 2015 Edition Products',
      downloadApiDocumentation: '#download-api-documentation',
    };
  }

  async getDownloadApiDocumentation() {
    return $(this.elements.downloadApiDocumentation);
  }
}

export default ApiDocumentationPage;
