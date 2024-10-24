import SearchPage from './search.page';

class DeveloperSearchPage extends SearchPage {
  constructor() {
    super();
    this.name = 'DeveloperSearchPage';
    this.elements = {
      ...this.elements,
      header: 'h1=Developers',
      composeMessageButton: '#compose-message',
      downloadDevelopersButton: '#download-developers',
    };
  }

  async open() {
    await super.open('organizations/developers');
    await (browser.waitUntil(async () => !(await this.isLoading())));
  }

  get composeMessageButton() {
    return $(this.elements.composeMessageButton);
  }

  get downloadDevelopersButton() {
    return $(this.elements.downloadDevelopersButton);
  }
}

export default DeveloperSearchPage;
