const { $ } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies
import SearchPage from './search.page';

class DeveloperSearchPage extends SearchPage {
  /*
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      header: 'h1=Developers',
      composeMessageButton: '#compose-message',
    };
  }
*/
  open () {
    return super.open('organizations/developers');
  }
}

export default DeveloperSearchPage;
