import Page from './page.es6';

class OverviewPage extends Page {
  constructor() {
    super();
    this.name = 'Developer';
    this.elements = {
      ...this.elements,
      title: 'h1',
      editDeveloperButton: '#developer-component-edit',
    };
  }

  async open(id) {
    await super.open(`organizations/developers/${id}`);
  }

  get title() {
    return $(this.elements.title);
  }

  get editDeveloperButton() {
    return $(this.elements.editDeveloperButton);
  }
}

export default OverviewPage;
