import CollectionPage from '../collection.po';

class ApiDocumentationPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h1=API Information for 2015 Edition Products',
      downloadApiDocumentation: '#download-api-documentation',
    };
  }

  get bodyText() {
    return $(this.elements.header).parentElement().nextElement();
  }

  get downloadApiDocumentation() {
    return $(this.elements.downloadApiDocumentation);
  }
}

export default ApiDocumentationPage;
