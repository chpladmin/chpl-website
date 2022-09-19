import CollectionPage from '../collection.async.po';

class ApiDocumentationPage extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      header: 'h1=API Information for 2015 Edition Products',
      downloadApiDocumentation: '#download-api-documentation',
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

  async getDownloadApiDocumentation() {
    return $(this.elements.downloadApiDocumentation);
  }
}

export default ApiDocumentationPage;
