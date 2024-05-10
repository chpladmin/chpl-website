import SearchPage from './search.page';

const { $ } = require('@wdio/globals'); // eslint-disable-line import/no-extraneous-dependencies

class DeveloperSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'DeveloperSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Developers',
      composeMessageButton: '#compose-message',
    };
  }

  open() {
    return super.open('organizations/developers');
  }

  get composeMessageButton() {
    return $(this.elements.composeMessageButton);
  }
}

export default DeveloperSearchPage;
