import Page from './page.es6';

class OverviewPage extends Page {
  constructor() {
    super();
    this.name = 'Overview';
    this.elements = {
      ...this.elements,
      acbatlTable: 'h2=ONC-ACB and ONC-ATL Information',
    };
  }

  async open() {
    await super.open('resources/overview');
  }

  get acbatlTable() {
    return $(this.elements.acbatlTable);
  }
}

export default OverviewPage;
