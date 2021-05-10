import CollectionsPage from '../collections.po';

const elements = {
  downloadApiDoc: '#downloadApiDocument',
};

class ApiDocumentationPage extends CollectionsPage {
  constructor () {
    super();
  }

  get downloadApiDocButton () {
    return $(elements.downloadApiDoc);
  }
  
}

export default ApiDocumentationPage;
